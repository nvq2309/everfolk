import type { Effect, LifeEvent } from "../../src/types.ts";

/**
 * Mirrors the engine's `InfluenceEntry` (lane B, `src/types.ts`).
 * Swap this for the engine export once the influence command is merged.
 */
export interface InfluenceEntry {
  id: string;
  label: string;
  baseWeight: 1 | 3 | 5;
  /** apply: numeric stat deltas are scaled by power and applied immediately. */
  effects?: Effect[];
  /** apply: queued as the next pending decision. activate: joins this life's event pool. */
  event?: LifeEvent;
}
