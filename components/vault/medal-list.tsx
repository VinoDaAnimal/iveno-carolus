import { MedalLabel } from "@/components/medal-label";
import { medals } from "@/lib/data";
import { ordinal } from "@/lib/rank";
import { cn } from "@/lib/utils";

const dot = { gold: "bg-gold", silver: "bg-silver", bronze: "bg-bronze" } as const;

/** Coin picker. Rendered statically on the server, then live (with `onSelect`) inside the island. */
export function MedalList({ selected = -1, onSelect }: { selected?: number; onSelect?: (i: number) => void }) {
  return (
    <ul className="mx-auto mt-6 grid max-w-6xl list-none gap-1 p-0 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
      {medals.map((x, i) => (
        <li key={x.id}>
          <button
            type="button"
            aria-pressed={selected === i}
            onClick={onSelect && (() => onSelect(i))}
            className={cn("flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-vault-edge", selected === i && "bg-vault-edge")}
          >
            <MedalLabel medal={x.medal} className="sr-only" />
            <span aria-hidden="true" className={cn("size-3 shrink-0 rounded-full", dot[x.medal])} />
            <span className="flex-1">{x.name}</span>
            <span aria-hidden="true" className="tabular-nums text-vault-muted">{x.rank}/{x.field}</span>
            <span className="sr-only">, {ordinal(x.rank)} of {x.field}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Same footprint as the live stage, so the swap causes no layout shift. */
export function VaultStage({ children }: { children?: React.ReactNode }) {
  return <div className="relative h-[min(72svh,42rem)]">{children}</div>;
}
