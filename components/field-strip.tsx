import type { Medal } from "@/lib/data";
import { cn } from "@/lib/utils";

const fill = { gold: "bg-gold", silver: "bg-silver", bronze: "bg-bronze" } as const;

function ticks(field: number) {
  let d = "";
  for (let i = 0; i < field; i++) d += `M${(((i + 0.5) / field) * 1000).toFixed(1)} 0V24`;
  return d;
}

/** One tick per entrant, first place on the left; the marker sits at `position` (0–100). */
export function FieldStrip({ field, position, medal, className }: { field: number; position: number; medal?: Medal; className?: string }) {
  return (
    <div className={cn("relative pt-3", className)} aria-hidden="true">
      <svg viewBox="0 0 1000 24" preserveAspectRatio="none" className="block h-6 w-full">
        <path d={ticks(field)} className="stroke-tick" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-foreground" style={{ left: `${position}%` }} />
      <span
        className={cn("absolute top-0 size-3.5 -translate-x-1/2 rounded-full ring-2 ring-background", medal ? fill[medal] : "bg-card outline outline-[1.5px] outline-foreground")}
        style={{ left: `${position}%` }}
      />
    </div>
  );
}
