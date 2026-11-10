import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createMockContract } from "../client/chain/mock-contract.ts";
import { startRankedSession } from "../client/chain/ranked-session.ts";
import { handleApi } from "../server/api.ts";
import { defaultRankedDependencies } from "../server/ranked/default-verifier.ts";
import type { Command, WorldPack } from "../src/types.ts";
import { TestDatabase } from "./support/d1.ts";

const CONTRACT = "everfolk-lives.testnet";
const SECRET = "07".repeat(32);
const world = JSON.parse(readFileSync(new URL("../worlds/ranked/alexandria-ranked-1.json", import.meta.url), "utf8")) as WorldPack;

test("a full ranked life verifies through the API with the real ranked world", async () => {
  const contract = createMockContract({ nobodyWeightBps: 3000 });
  const items = new Map<string, string>();
  const session = await startRankedSession({
    contract, contractId: CONTRACT, verifyUrl: "unused", world,
    storage: { getItem: k => items.get(k) ?? null, setItem: (k, v) => void items.set(k, v), removeItem: k => void items.delete(k) },
  });
  for (let i = 0; i < 20_000 && session.state.phase !== "ended"; i++) {
    const command: Command = session.state.phase === "choice" ? { type: "choose", choice: session.choices()[0].id } : { type: "advance" };
    await session.dispatch(command);
  }
  assert.equal(session.state.phase, "ended");
  const life = await contract.getLife(session.life.life_id);
  const rpc = (async () => new Response(JSON.stringify({ result: { result: [...new TextEncoder().encode(JSON.stringify(life))] } }))) as unknown as typeof fetch;
  const env = { DB: new TestDatabase(), RANKED_VERIFIER_SECRET: SECRET, RANKED_CONTRACT_ID: CONTRACT, NEAR_RPC_URL: "https://rpc.test", RANKED: { ...defaultRankedDependencies(), fetch: rpc } };
  const response = await handleApi(new Request("https://everfolk.test/api/ranked/verify", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ life_id: session.life.life_id, save: session.save() }),
  }), env);
  const body = await response.json();
  assert.equal(response.status, 200, body.error);
  assert.equal(body.evidence.seed, life!.seed);
  assert.equal(body.evidence.world_version, "alexandria-ranked-1");
  assert.equal(body.evidence.death_age, session.state.age);
  const minted = await contract.mintLife(session.life.life_id, body, body.evidence.career_group === "letters" ? "letters.teach" : `${body.evidence.career_group}.${{ military: "mentor", commerce: "credit", craft: "apprentice", sky: "omen", performance: "lift" }[body.evidence.career_group as string]}`);
  assert.ok(minted.token_id, "the mock contract accepts the verifier's evidence");
});
