"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/motion-provider";
import { RoleList, panelId } from "@/components/role-list";

// Unfolds like a card hinged at the top: rotateX + clip-path only.
const panel = (i: number, isOpen: boolean, content: React.ReactNode) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <m.div
        id={panelId(i)}
        key="panel"
        style={{ transformOrigin: "top center" }}
        initial={{ rotateX: -75, y: -8, clipPath: "inset(0 0 100% 0)" }}
        animate={{ rotateX: 0, y: 0, clipPath: "inset(0 0 0% 0)" }}
        exit={{ rotateX: -60, clipPath: "inset(0 0 100% 0)" }}
        transition={{ type: "tween", duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className="pb-6 md:pl-[calc(9rem+1.5rem)]"
      >
        {content}
      </m.div>
    )}
  </AnimatePresence>
);

export function ExperienceLive() {
  const [open, setOpen] = useState<number[]>([0]);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <MotionProvider>
      <RoleList open={open} onToggle={toggle} panel={panel} />
    </MotionProvider>
  );
}
