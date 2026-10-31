import { cn } from "@/lib/utils";

// Adapted from Magic UI shine-border (magicui.design/r/shine-border.json). The original animates
// `background-position`; this rotates a soft two-lobed gradient so only `transform` animates.
export function ShineBorder({ className, duration = 12 }: { className?: string; duration?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] p-px", className)}
      style={{ mask: "linear-gradient(black 0 0) content-box exclude, linear-gradient(black 0 0)" }}
    >
      <span
        className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-1/2 animate-spin-slow bg-[conic-gradient(transparent_0_10%,var(--medal-silver-tint)_25%,transparent_40%_60%,var(--medal-silver-tint)_75%,transparent_90%)] motion-reduce:animate-none"
        style={{ animationDuration: `${duration}s` }}
      />
    </span>
  );
}
