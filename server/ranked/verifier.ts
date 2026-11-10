import { sha256Hex } from "../../chain/hash.ts";
import type { Evidence, LifeView } from "../../chain/types.ts";
import { validateRankedSave } from "../../chain/validate-ranked.ts";
import { createEngine } from "../../src/index.ts";
import { canonicalJson } from "../../src/random.ts";
import type { LifeState, SaveFile, WorldPack } from "../../src/types.ts";
import { createEvidenceSigner } from "./signer.ts";

export type VerifierKind = "server-signer" | "tee";

export interface SignedEvidence {
  evidence: Evidence; evidence_json: string; evidence_hash: string; signature: string; verifier_kind: VerifierKind;
}

/** Replays a ranked life from its on-chain record and attests what happened. A TEE verifier implements the same interface. */
export interface LifeVerifier {
  readonly kind: VerifierKind;
  readonly publicKey: string;
  verify(life: LifeView, save: SaveFile): Promise<SignedEvidence>;
}

/** A player-facing reason the life cannot be minted. */
export class VerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VerificationError";
  }
}

export type BuildEvidence = (input: { life: LifeView; save: SaveFile; state: LifeState; worldFingerprint: string }) => Promise<Evidence>;

export async function createServerSignerVerifier(options: {
  secretHex: string; contractId: string; loadWorld(version: string): WorldPack | null; buildEvidence: BuildEvidence;
}): Promise<LifeVerifier> {
  const signer = await createEvidenceSigner(options.secretHex);
  return {
    kind: "server-signer",
    publicKey: signer.publicKey,
    async verify(life, save) {
      const check = await validateRankedSave(life, save, options.contractId);
      if (!check.ok) throw new VerificationError(check.reason);
      const world = options.loadWorld(life.world_version);
      if (!world) throw new VerificationError("This world version is not supported by the verifier.");
      const engine = createEngine(world);
      if (save.worldFingerprint !== engine.fingerprint) throw new VerificationError("This save was played on different world content.");
      let state: LifeState;
      try {
        state = engine.replay(save.seed, save.commands);
      } catch (error) {
        throw new VerificationError(`This life could not be replayed: ${error instanceof Error ? error.message : "unknown error"}`);
      }
      if (state.phase !== "ended") throw new VerificationError("This life has not ended yet.");
      const evidence = await options.buildEvidence({ life, save, state, worldFingerprint: engine.fingerprint });
      const evidenceJson = canonicalJson(evidence);
      return {
        evidence, evidence_json: evidenceJson, evidence_hash: await sha256Hex(evidenceJson),
        signature: await signer.sign(evidenceJson), verifier_kind: "server-signer",
      };
    },
  };
}
