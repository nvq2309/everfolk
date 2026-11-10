import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { KEY_DECISIONS } from "../chain/catalog/key-decisions.ts";
import { activationCommand, applyCommand, validateRankedSave } from "../chain/validate-ranked.ts";
import { createMockContract } from "../client/chain/mock-contract.ts";
import { startRankedSession, resumeRankedSession, type RankedSession, type SessionStorage } from "../client/chain/ranked-session.ts";
import type { Command, SaveFile, WorldPack } from "../src/types.ts";

const CONTRACT = "everfolk-lives.testnet";
const world = JSON.parse(readFileSync(new URL("../worlds/ranked/alexandria-ranked-1.json", import.meta.url), "utf8")) as WorldPack;

function memoryStorage(): SessionStorage & { items: Map<string, string> } {
  const items = new Map<string, string>();
  return { items, getItem: key => items.get(key) ?? null, setItem: (key, value) => void items.set(key, value), removeItem: key => void items.delete(key) };
}

const commandsOf = (session: RankedSession): Command[] => (JSON.parse(session.save()) as SaveFile).commands;

/** Plays with the first offered choice until `stop` holds or the life ends. */
async function playUntil(session: RankedSession, stop: (s: RankedSession) => boolean, limit = 2_000): Promise<void> {
  for (let i = 0; i < limit && session.state.phase !== "ended" && !stop(session); i++) {
    const command: Command = session.state.phase === "choice" ? { type: "choose", choice: session.choices()[0].id } : { type: "advance" };
    await session.dispatch(command);
  }
}

async function start(options: { nobodyWeightBps?: number } = {}) {
  const contract = createMockContract({ nobodyWeightBps: options.nobodyWeightBps ?? 0 });
  const storage = memoryStorage();
  const session = await startRankedSession({ contract, contractId: CONTRACT, verifyUrl: "https://everfolk.test/api/ranked/verify", world, storage });
  return { contract, storage, session };
}

test("figure activations are the first commands", async () => {
  const { session } = await start();
  assert.ok(session.life.figure_picks.length > 0, "the mock seeds one copy of each figure");
  const commands = commandsOf(session);
  session.life.figure_picks.forEach((pick, index) => assert.deepEqual(commands[index], activationCommand(pick, CONTRACT)));
});

test("key decision triggers exactly one draw", async () => {
  const { contract, session } = await start();
  await playUntil(session, s => s.lastDraw !== null);
  assert.ok(session.lastDraw, "a key decision came up and was drawn");
  const before = (await contract.getLife(session.life.life_id))!.draws.length;
  assert.equal(before, 1);
  assert.ok(Object.hasOwn(KEY_DECISIONS, session.state.pendingEventId ?? ""), "the drawn decision is still pending");
  const life = await contract.getLife(session.life.life_id);
  assert.equal(life!.draws[0].category, KEY_DECISIONS[session.state.pendingEventId!]);
});

test("non-null draw inserts apply influence at draw.step", async () => {
  const { session } = await start({ nobodyWeightBps: 0 });
  await playUntil(session, s => s.lastDraw?.token_id != null);
  const draw = session.lastDraw!;
  assert.ok(draw.token_id, "with no nobody weight the pool always answers");
  assert.deepEqual(commandsOf(session)[draw.step], applyCommand(draw, CONTRACT));
});

test("influence commands cannot be dispatched by the player", async () => {
  const { session } = await start();
  await assert.rejects(
    session.dispatch({ type: "influence", mode: "apply", entry: "letters.teach", power: 3, source: { contractId: CONTRACT, tokenId: "1" } }),
    /only come from the chain/,
  );
});

test("checkpoint every 5 years", async () => {
  const { contract, session } = await start();
  await playUntil(session, s => s.state.age >= 11);
  const checkpoints = (await contract.getLife(session.life.life_id))!.checkpoints;
  assert.ok(checkpoints.length >= 2, `expected checkpoints at ages 5 and 10, got ${checkpoints.length}`);
});

test("session save passes validateRankedSave", async () => {
  const { contract, session } = await start({ nobodyWeightBps: 5000 });
  await playUntil(session, s => s.state.age >= 25);
  const life = (await contract.getLife(session.life.life_id))!;
  assert.deepEqual(await validateRankedSave(life, JSON.parse(session.save()) as SaveFile, CONTRACT), { ok: true });
});

test("the save is persisted and resumes without rewinding", async () => {
  const { contract, storage, session } = await start();
  await playUntil(session, s => s.state.age >= 6);
  const key = `everfolk.ranked.${session.life.life_id}`;
  assert.equal(storage.getItem(key), session.save());
  const resumed = await resumeRankedSession({ contract, contractId: CONTRACT, verifyUrl: "x", world, storage }, session.life.life_id);
  assert.equal(resumed.save(), session.save());
  assert.equal(resumed.state.age, session.state.age);
});

test("finish sends the save to the verifier and returns signed evidence", async () => {
  const { session } = await start({ nobodyWeightBps: 5000 });
  await playUntil(session, () => false, 20_000);
  assert.equal(session.state.phase, "ended");
  const calls: { url: string; body: unknown }[] = [];
  const fakeFetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)) });
    return new Response(JSON.stringify({ evidence_hash: "e".repeat(64), signature: "a".repeat(128) }));
  }) as unknown as typeof fetch;
  const signed = await session.finish(fakeFetch);
  assert.equal(signed.signature, "a".repeat(128));
  assert.deepEqual(calls[0].body, { life_id: session.life.life_id, save: session.save() });
});

test("finish reports the verifier's reason when it refuses", async () => {
  const { session } = await start();
  await playUntil(session, () => false, 20_000);
  const refuse = (async () => new Response(JSON.stringify({ error: "This life has not ended yet." }), { status: 400 })) as unknown as typeof fetch;
  await assert.rejects(session.finish(refuse), /This life has not ended yet\./);
});

test("resuming while a drawn decision is still pending does not draw again", async () => {
  const { contract, storage, session } = await start({ nobodyWeightBps: 0 });
  await playUntil(session, s => s.lastDraw?.token_id != null);
  const drawsBefore = (await contract.getLife(session.life.life_id))!.draws.length;
  const resumed = await resumeRankedSession({ contract, contractId: CONTRACT, verifyUrl: "x", world, storage }, session.life.life_id);
  await resumed.dispatch({ type: "choose", choice: resumed.choices()[0].id });
  const after = (await contract.getLife(session.life.life_id))!;
  const extra = after.draws.slice(drawsBefore).filter(d => d.step <= after.draws[drawsBefore - 1].step + 1);
  assert.deepEqual(extra, []);
});

test("sync replays commands made by the free engine and draws at key decisions", async () => {
  const { contract, session } = await start({ nobodyWeightBps: 0 });
  const { createEngine } = await import("../src/index.ts");
  const free = createEngine(world);
  let next = session.state;
  let keyDecisionsPassed = 0;
  for (let i = 0; i < 5_000 && next.phase !== "ended" && (keyDecisionsPassed < 2 || next.age < 30); i++) {
    if (next.phase === "choice" && Object.hasOwn(KEY_DECISIONS, next.pendingEventId ?? "")) keyDecisionsPassed++;
    next = next.phase === "choice" ? free.choose(next, free.getChoices(next)[0].id) : free.advance(next);
  }
  assert.ok(keyDecisionsPassed >= 2, "the free engine passed key decisions inside the batch");
  const synced = await session.sync(next);
  assert.equal(synced, session.state);
  const life = (await contract.getLife(session.life.life_id))!;
  assert.ok(life.draws.length > 0, "key decisions inside the batch were drawn on chain");
  assert.ok(life.checkpoints.length >= 4, "checkpoints were recorded while replaying");
  assert.deepEqual(await validateRankedSave(life, JSON.parse(session.save()) as SaveFile, CONTRACT), { ok: true });
});

test("sync rejects a state that does not continue this ranked life", async () => {
  const { session } = await start();
  const { createEngine } = await import("../src/index.ts");
  const other = createEngine(world).start("cd".repeat(32));
  await assert.rejects(session.sync(other), /does not continue this ranked life/);
});
