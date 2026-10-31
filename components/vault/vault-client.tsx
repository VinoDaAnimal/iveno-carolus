"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/motion-provider";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShineBorder } from "@/components/ui/shine-border";
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
  const [selected, setSelected] = useState(0);
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
          (i) => setSelected(Math.max(0, Math.min(medals.length - 1, i))),
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
        stage={<canvas ref={canvasRef} aria-hidden="true" className="block size-full cursor-pointer" />}
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
