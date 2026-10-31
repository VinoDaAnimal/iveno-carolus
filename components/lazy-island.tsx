"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

type Loader = () => Promise<ComponentType>;

/**
 * Shows the server-rendered `children` until the block is within 600px of the viewport,
 * then swaps in the interactive version. Keeps its JavaScript (and Motion) out of the first load.
 */
export function LazyIsland({ load, children }: { load: Loader; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Live, setLive] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      load().then((C) => setLive(() => C));
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  return Live ? <Live /> : <div ref={ref}>{children}</div>;
}
