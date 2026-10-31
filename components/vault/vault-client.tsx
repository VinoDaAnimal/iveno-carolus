"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { FieldStrip } from "@/components/field-strip";
import { MedalLabel } from "@/components/medal-label";
import { MotionProvider } from "@/components/motion-provider";
import { MedalList, VaultStage } from "@/components/vault/medal-list";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShineBorder } from "@/components/ui/shine-border";
import { medals } from "@/lib/data";
import { slotCentre, topPct } from "@/lib/rank";

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function VaultLive() {
  return (
    <MotionProvider>
      <VaultClient />
    </MotionProvider>
  );
}

function VaultClient() {
  const [selected, setSelected] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{ select(i: number): void; dispose(): void } | null>(null);
  const toggle = (i: number) => setSelected((s) => (s === i ? -1 : i));

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
          (i) => setSelected((s) => (s === i ? -1 : i)),
        );
      } catch {
        // No WebGL: the list below still selects and shows every card.
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
    sceneRef.current?.select(selected);
    if (selected < 0) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(-1);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [selected]);

  const f = selected >= 0 ? medals[selected] : null;

  return (
    <>
      <VaultStage>
        <canvas ref={canvasRef} aria-hidden="true" className="block size-full cursor-pointer" />
        <div className="pointer-events-none relative -mt-20 flex justify-center px-4 md:absolute md:inset-x-0 md:bottom-3 md:mt-0" aria-live="polite">
          <AnimatePresence initial={false} mode="wait">
            {f && (
              <m.article
                key={f.id}
                initial={{ y: 40, scale: 0.96, clipPath: "inset(40% 0 0 0 round 16px)" }}
                animate={{ y: 0, scale: 1, clipPath: "inset(0% 0 0 0 round 16px)" }}
                exit={{ y: 24, scale: 0.98, clipPath: "inset(100% 0 0 0 round 16px)" }}
                transition={{ type: "tween", duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="pointer-events-auto relative w-full max-w-2xl rounded-2xl bg-vault-glass p-5 text-vault-foreground ring-1 ring-vault-edge backdrop-blur-xl md:p-6"
              >
                {f.medal === "gold" && <BorderBeam />}
                {f.medal === "silver" && <ShineBorder />}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <MedalLabel medal={f.medal} className="text-sm text-vault-muted" />
                    <h3 className="mt-1 text-xl font-bold leading-tight">{f.name}</h3>
                  </div>
                  <button type="button" onClick={() => setSelected(-1)} className="-mr-2 -mt-1 min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold text-vault-muted hover:text-vault-foreground">
                    Close
                  </button>
                </div>
                <p className="mt-2 text-vault-muted">{f.question}</p>
                <dl className="mt-4 grid grid-cols-3 gap-3">
                  <div><dt className="text-xs text-vault-muted">Rank</dt><dd className="m-0 text-3xl font-extrabold tracking-[-0.03em]">{f.rank}</dd></div>
                  <div><dt className="text-xs text-vault-muted">Entrants</dt><dd className="m-0 text-3xl font-extrabold tracking-[-0.03em]">{f.field}</dd></div>
                  <div><dt className="text-xs text-vault-muted">Top</dt><dd className="m-0 text-3xl font-extrabold tracking-[-0.03em]">{topPct(f.rank, f.field)}%</dd></div>
                </dl>
                <FieldStrip field={f.field} position={slotCentre(f.rank, f.field)} medal={f.medal} className="mt-3 [--background:var(--vault)] [--tick:var(--vault-edge)] [--foreground:var(--vault-foreground)]" />
                <p className="mt-3 text-sm text-vault-muted">{f.tags.join(", ")}</p>
                <p className="mt-1 text-sm text-vault-muted">{f.prize.startsWith("Knowledge") ? f.prize : `Prize pool: ${f.prize}`}</p>
                <a href={f.url} className="mt-3 inline-block font-semibold text-vault-foreground underline underline-offset-4">View the competition on Zindi</a>
              </m.article>
            )}
          </AnimatePresence>
        </div>
      </VaultStage>
      <MedalList selected={selected} onSelect={toggle} />
    </>
  );
}
