import type { MedalResult } from "@/lib/data";
import { cn } from "@/lib/utils";

const metal = {
  gold: "from-gold via-gold-tint to-gold",
  silver: "from-silver via-silver-tint to-silver",
  bronze: "from-bronze via-bronze-tint to-bronze",
} as const;

/** Flat stand-in for the selected coin while three.js loads (or if WebGL is unavailable). */
export function CoinPlaceholder({ f }: { f: MedalResult }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className={cn("grid aspect-square h-[64%] place-items-center rounded-full bg-linear-135 p-[7%] shadow-2xl", metal[f.medal])}>
        <div className="grid size-full place-items-center rounded-full bg-linear-135 from-vault-foreground/70 to-vault-foreground/30 text-center ring-2 ring-black/15">
          <span className="leading-none text-vault">
            <span className="block text-[clamp(1.75rem,9vw,3.5rem)] font-extrabold tracking-[-0.04em]">{f.rank}</span>
            <span className="block text-xs font-semibold sm:text-sm">of {f.field}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
