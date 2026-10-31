import { cn } from "@/lib/utils";

// Adapted from Magic UI border-beam (magicui.design/r/border-beam.json). The original moves a
// gradient along `offset-path`; this rotates a conic gradient instead, so only `transform` animates.
export function BorderBeam({ className, duration = 6 }: { className?: string; duration?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] p-[1.5px]", className)}
      style={{ mask: "linear-gradient(black 0 0) content-box exclude, linear-gradient(black 0 0)" }}
    >
      <span
        className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-1/2 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_68%,var(--medal-gold)_82%,var(--medal-gold-tint)_92%,transparent_100%)] motion-reduce:animate-none"
        style={{ animationDuration: `${duration}s` }}
      />
    </span>
  );
}
