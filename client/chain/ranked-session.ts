import { keyDecisionCategory } from "../../chain/catalog/key-decisions.ts";
import { commandsHash } from "../../chain/hash.ts";
import { RANKED_WORLD_VERSION } from "../../chain/ids.ts";
import { activationCommand, applyCommand } from "../../chain/validate-ranked.ts";
import { createEngine } from "../../src/index.ts";
import type { Choice, Command, LifeEngine, LifeState, SaveFile, WorldPack } from "../../src/types.ts";
import type { Draw, LifeView, LivesContract, MintResult, SignedEvidence } from "./types.ts";

const CHECKPOINT_YEARS = 5;

export interface SessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface RankedSessionOptions {
  contract: LivesContract;
  /** Account id of the lives contract; it is the `source.contractId` of every influence. */
  contractId: string;
  verifyUrl: string;
  world: WorldPack;
  storage?: SessionStorage;
}

/** A ranked life: every step is saved, key decisions draw on chain, and there is no way to rewind. */
export interface RankedSession {
  readonly life: LifeView;
  readonly state: LifeState;
  readonly pendingDraw: boolean;
  readonly lastDraw: Draw | null;
  choices(): readonly Choice[];
  save(): string;
  /** Engine step, then the 5-year checkpoint and any key-decision draw. Influences only come from the chain. */
  dispatch(command: Command): Promise<void>;
  /**
   * Adopts a state produced by the ordinary game loop from this session's state: its new commands are replayed one by
   * one through `dispatch`, so each key decision draws on chain first. Replay stops at the first command the drawn
   * influences made impossible; the returned state (this session's) is what the player continues from.
   */
  sync(next: LifeState): Promise<LifeState>;
  finish(fetcher?: typeof fetch): Promise<SignedEvidence>;
  mint(signed: SignedEvidence, npcActionId: string): Promise<MintResult>;
  abandon(): Promise<void>;
}

export const rankedSaveKey = (lifeId: string) => `everfolk.ranked.${lifeId}`;

function browserStorage(): SessionStorage {
  if (typeof localStorage === "undefined") throw new Error("Ranked lives need browser storage to keep their progress.");
  return localStorage;
}

class Session implements RankedSession {
  life: LifeView;
  state: LifeState;
  pendingDraw = false;
  lastDraw: Draw | null = null;
  private readonly engine: LifeEngine;
  private readonly options: RankedSessionOptions;
  private readonly storage: SessionStorage;

  constructor(options: RankedSessionOptions, life: LifeView, state: LifeState) {
    this.options = options;
    this.storage = options.storage ?? browserStorage();
    this.engine = createEngine(options.world);
    this.life = life;
    this.state = state;
  }

  static engineFor(world: WorldPack): LifeEngine {
    return createEngine(world);
  }

  choices(): readonly Choice[] {
    return this.engine.getChoices(this.state);
  }

  save(): string {
    return this.engine.save(this.state);
  }

  private commands(): Command[] {
    return (JSON.parse(this.save()) as SaveFile).commands;
  }

  private persist(): void {
    this.storage.setItem(rankedSaveKey(this.life.life_id), this.save());
  }

  async applyFigures(): Promise<void> {
    for (const pick of this.life.figure_picks) this.state = this.engine.influence(this.state, activationCommand(pick, this.options.contractId));
    this.persist();
    await this.drawIfKeyDecision();
  }

  async dispatch(command: Command): Promise<void> {
    if (command.type === "influence") throw new Error("Influences only come from the chain.");
    if (this.state.phase === "ended") throw new Error("This life has ended.");
    const ageBefore = this.state.age;
    this.state = this.step(command);
    this.persist();
    if (Math.floor(this.state.age / CHECKPOINT_YEARS) > Math.floor(ageBefore / CHECKPOINT_YEARS)) await this.checkpoint();
    await this.drawIfKeyDecision();
  }

  async sync(next: LifeState): Promise<LifeState> {
    const mine = this.commands();
    const theirs = (JSON.parse(this.engine.save(next)) as SaveFile).commands;
    const continues = next.seed === this.state.seed && theirs.length >= mine.length &&
      mine.every((command, index) => JSON.stringify(command) === JSON.stringify(theirs[index]));
    if (!continues) throw new Error("This state does not continue this ranked life.");
    for (const command of theirs.slice(mine.length)) {
      if (this.state.phase === "ended") break;
      try {
        await this.dispatch(command);
      } catch (error) {
        if (error instanceof Error && /chain|network|wallet|rpc|fetch/i.test(error.message)) throw error;
        break; // An on-chain influence changed what this command could do; the player continues from here.
      }
    }
    return this.state;
  }

  private step(command: Command): LifeState {
    switch (command.type) {
      case "advance": return this.engine.advance(this.state);
      case "choose": return this.engine.choose(this.state, command.choice);
      case "act": return this.engine.act(this.state, command.activity);
      case "avatar": return this.engine.chooseAvatar(this.state, command.variant);
      default: throw new Error("Unknown command.");
    }
  }

  private async checkpoint(): Promise<void> {
    const commands = this.commands();
    await this.options.contract.checkpoint(this.life.life_id, commands.length, await commandsHash(commands, commands.length));
  }

  /** Draws once per pending key decision; a retry at the same step returns the same draw from the chain. */
  private async drawIfKeyDecision(): Promise<void> {
    const category = this.state.phase === "choice" && this.state.pendingEventId ? keyDecisionCategory(this.state.pendingEventId) : null;
    if (!category) return;
    const commands = this.commands();
    const step = commands.length;
    // Already drawn here, or a filled draw at step - 1 inserted the influence this decision is still waiting on.
    if (this.life.draws.some(draw => draw.step === step || (draw.token_id !== null && draw.step === step - 1))) return;
    this.pendingDraw = true;
    try {
      const draw = await this.options.contract.drawNpc(this.life.life_id, step, category, await commandsHash(commands, step));
      this.lastDraw = draw;
      this.life = { ...this.life, draws: [...this.life.draws, draw] };
      if (draw.token_id) {
        this.state = this.engine.influence(this.state, applyCommand(draw, this.options.contractId));
        this.persist();
      }
    } finally {
      this.pendingDraw = false;
    }
  }

  async finish(fetcher: typeof fetch = fetch): Promise<SignedEvidence> {
    if (this.state.phase !== "ended") throw new Error("This life has not ended yet.");
    const response = await fetcher(this.options.verifyUrl, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ life_id: this.life.life_id, save: this.save() }),
    });
    const body = (await response.json().catch(() => ({}))) as SignedEvidence & { error?: string };
    if (!response.ok) throw new Error(body.error ?? "The life could not be verified. Please try again.");
    return body;
  }

  async mint(signed: SignedEvidence, npcActionId: string): Promise<MintResult> {
    const result = await this.options.contract.mintLife(this.life.life_id, signed, npcActionId);
    this.storage.removeItem(rankedSaveKey(this.life.life_id));
    return result;
  }

  async abandon(): Promise<void> {
    await this.options.contract.abandonLife(this.life.life_id);
    this.storage.removeItem(rankedSaveKey(this.life.life_id));
  }
}

/** Starts a ranked life: the contract chooses the seed and the figures that shape this world. */
export async function startRankedSession(options: RankedSessionOptions): Promise<RankedSession> {
  const life = await options.contract.startLife(RANKED_WORLD_VERSION);
  const session = new Session(options, life, Session.engineFor(options.world).start(life.seed));
  await session.applyFigures();
  return session;
}

/** Reloads the saved progress of a ranked life that is still alive on chain. */
export async function resumeRankedSession(options: RankedSessionOptions, lifeId: string): Promise<RankedSession> {
  const life = await options.contract.getLife(lifeId);
  if (!life || life.status !== "alive") throw new Error("This ranked life is no longer in progress.");
  const saved = (options.storage ?? browserStorage()).getItem(rankedSaveKey(lifeId));
  if (!saved) throw new Error("This device has no saved progress for this ranked life.");
  const state = Session.engineFor(options.world).load(saved);
  if (state.seed !== life.seed) throw new Error("The saved progress belongs to a different life.");
  return new Session(options, life, state);
}
