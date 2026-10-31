import type { Medal } from "@/lib/data";
import { cn } from "@/lib/utils";

const disc = {
  gold: "from-gold via-gold-tint to-gold",
  silver: "from-silver via-silver-tint to-silver",
  bronze: "from-bronze via-bronze-tint to-bronze",
} as const;

export function MedalLabel({ medal, className }: { medal: Medal; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", className)}>
      <span aria-hidden="true" className={cn("size-5 rounded-full bg-linear-135", disc[medal])} />
      {medal[0].toUpperCase() + medal.slice(1)} medal
    </span>
  );
}
