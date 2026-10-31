"use client";

import { useEffect } from "react";
import { useAnimate } from "motion/react-mini";
import type { Medal } from "@/lib/data";
import { ordinal } from "@/lib/rank";
import type { Safe } from "./crowd-scene";

type Field = { medal: Medal; rank: number; field: number };
const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** The part of the stage the step's card leaves free: below it on phones, beside it on wider screens. */
function freeArea(step: HTMLElement): Safe {
  const w = innerWidth, h = innerHeight;
  const card = step.querySelector<HTMLElement>("[data-card]");
  if (!card) return { left: 16, top: 16, right: w - 16, bottom: h - 16 };
  // Card and step share an offsetParent; offsets ignore the swish transform.
  const right = card.offsetLeft - step.offsetLeft + card.offsetWidth;
  const bottom = card.offsetTop - step.offsetTop + card.offsetHeight;
  return w < 768
    ? { left: 16, top: bottom + 40, right: w - 16, bottom: h - 20 }
    : { left: right + 40, top: 48, right: w - 32, bottom: h - 32 };
}

/** Behaviour only: the markup is server-rendered by CrowdSection. */
export function CrowdController({ fields }: { fields: Field[] }) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();

  useEffect(() => {
    const section = scope.current?.closest("section");
    const canvas = section?.querySelector<HTMLCanvasElement>("[data-crowd-canvas]");
    const first = section?.querySelector<HTMLElement>("[data-label-first]");
    const me = section?.querySelector<HTMLElement>("[data-label-me]");
    if (!section || !canvas || !first || !me) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepEls = [...section.querySelectorAll<HTMLElement>("[data-step]")];
    let scene: { setShot(i: number, area: Safe): void; dispose(): void } | undefined;
    let shot = 0;
    let disposed = false;
    const aim = () => {
      if (shot > 0) me.textContent = `Iveno, ${ordinal(fields[shot - 1].rank)}`;
      scene?.setShot(shot, freeArea(stepEls[shot]));
    };

    // Snap one competition per swipe, only while the crowd is on screen.
    // The 2px inset stops an edge-touching section (bottom at y=0) from counting as on screen.
    const snap = new IntersectionObserver(([e]) => document.documentElement.classList.toggle("snap-crowd", e.isIntersecting), { rootMargin: "-2px 0px -2px 0px" });
    snap.observe(section);

    // three.js loads only when the section is close.
    const near = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      try {
        const { createCrowdScene } = await import("./crowd-scene");
        if (disposed) return;
        scene = createCrowdScene(canvas, fields, {
          stage: css("--stage"), block: css("--crowd-block"),
          gold: css("--medal-gold"), silver: css("--medal-silver"), bronze: css("--medal-bronze"),
        }, reduce, { first, me });
        aim();
      } catch {
        // No WebGL: the step cards carry the same data as 2D strips.
      }
    }, { rootMargin: "600px 0px" });
    near.observe(section);

    const steps = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        shot = Number((e.target as HTMLElement).dataset.step);
        aim();
        const card = e.target.querySelector("[data-card]");
        // The swish: starts from an offset transform, never from hidden.
        if (card && !reduce) animate(card, { transform: ["translate(-28px, -16px) scale(0.96)", "none"] }, { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] });
      }
    }, { rootMargin: "-45% 0px -45% 0px" });
    stepEls.forEach((s) => steps.observe(s));
    addEventListener("resize", aim);

    // One wheel gesture = one competition. CSS snap alone springs back on short scrolls.
    let lockedUntil = 0;
    const onWheel = (e: WheelEvent) => {
      const r = section.getBoundingClientRect();
      if (r.top > 1 || r.bottom < innerHeight - 1 || Math.abs(e.deltaY) < 4 || e.ctrlKey) return;
      const current = Math.round(-r.top / innerHeight);
      const dir = Math.sign(e.deltaY);
      if (current === 0 && dir < 0) return; // back up into the hero: native scroll
      e.preventDefault();
      if (performance.now() < lockedUntil) return;
      lockedUntil = performance.now() + 750;
      const next = current + dir;
      const target = next < stepEls.length ? stepEls[next].getBoundingClientRect().top : r.bottom;
      scrollBy({ top: target, behavior: reduce ? "auto" : "smooth" });
    };
    addEventListener("wheel", onWheel, { passive: false });

    return () => {
      removeEventListener("wheel", onWheel);
      removeEventListener("resize", aim);
      disposed = true;
      snap.disconnect();
      near.disconnect();
      steps.disconnect();
      scene?.dispose();
      document.documentElement.classList.remove("snap-crowd");
    };
  }, [scope, animate, fields]);

  return <span ref={scope} hidden />;
}
