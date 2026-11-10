// Plays and mints "genesis" ranked lives on testnet so the NPC draw pools are not empty for the demo.
//   CONTRACT_ID=everfolk-lives-11101338.testnet COUNT=6 node scripts/ranked/seed-genesis.ts
// Needs RANKED_VERIFIER_SECRET in .dev.vars (the key registered on the contract). Accounts come from the testnet faucet.
import { readFileSync } from "node:fs";
import { buildEvidence } from "../../chain/evidence.ts";
import { NPC_ACTIONS, RANKED_WORLD_VERSION, type CareerGroup } from "../../chain/ids.ts";
import { startRankedSession } from "../../client/chain/ranked-session.ts";
import { createServerSignerVerifier } from "../../server/ranked/verifier.ts";
import type { Command, WorldPack } from "../../src/types.ts";
import { createCliContract, createFaucetAccount } from "./cli-contract.ts";

const ROOT = new URL("../../", import.meta.url);
const contractId = process.env.CONTRACT_ID ?? "";
const count = Number(process.env.COUNT ?? 6);
if (!contractId) throw new Error("Set CONTRACT_ID.");
const secret = /RANKED_VERIFIER_SECRET=([0-9a-f]{64})/.exec(readFileSync(new URL(".dev.vars", ROOT), "utf8"))?.[1];
if (!secret) throw new Error("RANKED_VERIFIER_SECRET is missing from .dev.vars.");
const world = JSON.parse(readFileSync(new URL("worlds/ranked/alexandria-ranked-1.json", ROOT), "utf8")) as WorldPack;

/** Small deterministic PRNG so each genesis life explores different choices. */
function chooser(seed: number): (n: number) => number {
  let x = seed || 1;
  return n => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return Math.abs(x) % n; };
}

async function genesisLife(index: number, stamp: number): Promise<string> {
  const account = `genesis-${stamp}-${index}.testnet`;
  await createFaucetAccount(account);
  const contract = createCliContract(contractId, account);
  const items = new Map<string, string>();
  const session = await startRankedSession({
    contract, contractId, verifyUrl: "in-process", world,
    storage: { getItem: k => items.get(k) ?? null, setItem: (k, v) => void items.set(k, v), removeItem: k => void items.delete(k) },
  });
  const pick = chooser(stamp + index * 7919);
  for (let i = 0; i < 20_000 && session.state.phase !== "ended"; i++) {
    const choices = session.choices();
    const command: Command = session.state.phase === "choice" ? { type: "choose", choice: choices[pick(choices.length)].id } : { type: "advance" };
    await session.dispatch(command);
  }
  const verifier = await createServerSignerVerifier({ secretHex: secret!, contractId, buildEvidence, loadWorld: v => (v === RANKED_WORLD_VERSION ? world : null) });
  const life = await contract.getLife(session.life.life_id);
  const signed = await verifier.verify(life!, JSON.parse(session.save()));
  const group = signed.evidence.career_group as CareerGroup;
  const action = NPC_ACTIONS[group].actions[index % 2];
  const minted = await session.mint(signed, action);
  return `${account}: life ${session.life.life_id} → token ${minted.token_id} (${minted.kind}${minted.figure_id ? ` ${minted.figure_id}` : ""}, ${group}/${action}, rarity ${minted.rarity}, affection ${minted.affection}, age ${signed.evidence.death_age}, ${signed.evidence.sources.length} sources)`;
}

const stamp = Math.floor(Date.now() / 1000);
// One life at a time: the public testnet RPC rate-limits parallel signers.
for (let i = 1; i <= count; i++) {
  try {
    console.log(`✓ ${await genesisLife(i, stamp)}`);
  } catch (error) {
    console.log(`✗ life ${i}: ${(error as Error).message.slice(0, 300)}`);
    process.exitCode = 1;
  }
}
