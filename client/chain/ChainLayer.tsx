import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import type { LifeView } from "../../chain/types.ts";
import { useChainBackend, type ChainBackend } from "./chain-backend.ts";
import { chainHref, parseChainRoute, type ChainRoute } from "./chain-route.ts";
import RankedEnding, { type RankedEndingSession } from "./RankedEnding.tsx";
import RankedEntry from "./RankedEntry.tsx";
import "./chain.css";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function useChainRoute(): ChainRoute | null {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  return parseChainRoute(hash);
}

/** Back to the game: drop the hash without leaving a bare "#" in the address bar. */
export function leaveChainRoute(): void {
  window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function ChainShell({ backend, focusKey, children }: { backend: ChainBackend | null; focusKey: string; children: ReactNode }) {
  const shell = useRef<HTMLDivElement>(null);
  useEffect(() => { shell.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true }); }, [focusKey, backend === null]);
  return <div className="chain-screen" ref={shell}>
    <div className="chain-shell">
      <header className="chain-topline">
        <a href="/" onClick={event => { event.preventDefault(); leaveChainRoute(); }}><span aria-hidden="true">←</span> Back to Everfolk</a>
        <nav aria-label="Ranked"><a href="#ranked">Ranked life</a></nav>
        {backend?.mode === "preview" && <span className="chain-preview" title="Lives, coins and sales here are not recorded anywhere.">Practice ledger</span>}
      </header>
      {children}
    </div>
  </div>;
}

/** An active ranked session as GameClient holds it; `state` is the engine's life state. */
export type ChainLayerSession = RankedEndingSession & { state: { phase: string } };

export interface ChainLayerProps {
  /** Hands a started ranked life to the ranked session (Task 17). */
  onBeginRanked?(life: LifeView): void;
  /** Only a ranked life shows the end-of-life report; free play passes nothing. */
  rankedSession?: ChainLayerSession | null;
  onRankedClosed?(): void;
}

/** Ranked screens over the game, opened by hash routes. The game stays mounted underneath. */
export default function ChainLayer({ onBeginRanked, rankedSession, onRankedClosed }: ChainLayerProps) {
  const route = useChainRoute();
  const backend = useChainBackend();
  if (rankedSession?.state.phase === "ended" && backend && !route) {
    return <ChainShell backend={backend} focusKey={`ending:${rankedSession.life.life_id}`}>
      <RankedEnding session={rankedSession} contract={backend.contract} onClose={() => onRankedClosed?.()} />
    </ChainShell>;
  }
  if (!route) return null;
  let content: ReactNode = <p className="chain-loading" role="status">Opening the ledger…</p>;
  if (backend && route.kind === "ranked") content = <RankedEntry backend={backend} onBegin={onBeginRanked} />;
  return <ChainShell backend={backend} focusKey={chainHref(route)}>{content}</ChainShell>;
}
