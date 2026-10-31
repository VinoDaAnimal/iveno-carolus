"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/motion-provider";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShineBorder } from "@/components/ui/shine-border";
import { CoinPlaceholder } from "@/components/vault/coin-placeholder";
import { MedalDetail, glassCard } from "@/components/vault/medal-detail";
import { MedalList, VaultLayout } from "@/components/vault/medal-list";
import { medals } from "@/lib/data";

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function VaultLive() {
  return (
    <MotionProvider>
      <VaultClient />
    </MotionProvider>
  );
}

function VaultClient() {
  // One medal is always turned over, so it's obvious the coins and the list open details.
  const [selected, setSelectedRaw] = useState(0);
  // The swipe hint stays until the visitor moves through the medals once (it comes back on every visit).
  const [moved, setMoved] = useState(false);
  const [ready, setReady] = useState(false);
  const setSelected = (i: number) => { setMoved(true); setSelectedRaw(Math.max(0, Math.min(medals.length - 1, i))); };
  const selectedRef = useRef(selected);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{ select(i: number): void; dispose(): void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    const near = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      try {
        const [{ createMedalScene }] = await Promise.all([import("./medal-scene"), document.fonts.ready]);
        if (disposed) return;
        sceneRef.current = createMedalScene(
          canvas,
          medals,
          { gold: css("--medal-gold"), silver: css("--medal-silver"), bronze: css("--medal-bronze") },
          getComputedStyle(document.body).fontFamily,
          matchMedia("(prefers-reduced-motion: reduce)").matches,
          (i) => { setMoved(true); setSelectedRaw(Math.max(0, Math.min(medals.length - 1, i))); },
          () => setReady(true),
        );
        sceneRef.current.select(selectedRef.current);
      } catch {
        // No WebGL: the picker still selects and shows every card.
      }
    }, { rootMargin: "600px 0px" });
    near.observe(canvas);
    return () => {
      disposed = true;
      near.disconnect();
      sceneRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    selectedRef.current = selected;
    sceneRef.current?.select(selected);
  }, [selected]);

  const f = medals[selected];

  return (
    <>
      <VaultLayout
        stage={
          <>
            <canvas ref={canvasRef} aria-hidden="true" className="block size-full cursor-pointer" />
            {!ready && <CoinPlaceholder f={f} />}
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                aria-label={d < 0 ? "Previous medal" : "Next medal"}
                disabled={selected + d < 0 || selected + d >= medals.length}
                onClick={() => setSelected(selected + d)}
                className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-vault-glass text-2xl leading-none ring-1 ring-vault-edge backdrop-blur disabled:invisible ${d < 0 ? "left-0" : "right-0"}`}
              >
                <span aria-hidden="true">{d < 0 ? "‹" : "›"}</span>
              </button>
            ))}
            {!moved && (
              <p className="pointer-events-none absolute inset-x-0 bottom-1 flex items-center justify-center gap-2 text-xs font-semibold text-vault-muted">
                <span aria-hidden="true" className="inline-block animate-[nudge_1.4s_ease-in-out_infinite] motion-reduce:animate-none">←</span>
                <span className="pointer-coarse:hidden">Use the arrows for more medals</span>
                <span className="hidden pointer-coarse:inline">Swipe for more medals</span>
                <span aria-hidden="true" className="inline-block animate-[nudge_1.4s_ease-in-out_infinite_reverse] motion-reduce:animate-none">→</span>
              </p>
            )}
          </>
        }
        card={
          <AnimatePresence initial={false} mode="wait">
            <m.article
              key={f.id}
              initial={{ y: 28, scale: 0.97, clipPath: "inset(30% 0 0 0 round 16px)" }}
              animate={{ y: 0, scale: 1, clipPath: "inset(0% 0 0 0 round 16px)" }}
              exit={{ y: -12, scale: 0.98, clipPath: "inset(0 0 100% 0 round 16px)" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className={glassCard}
            >
              {f.medal === "gold" && <BorderBeam />}
              {f.medal === "silver" && <ShineBorder />}
              <MedalDetail f={f} />
            </m.article>
          </AnimatePresence>
        }
      />
      <MedalList selected={selected} onSelect={setSelected} />
    </>
  );
}
