import { medals } from "@/lib/data";
import { ordinal } from "@/lib/rank";
import { cn } from "@/lib/utils";

const dot = { gold: "from-gold via-gold-tint to-gold", silver: "from-silver via-silver-tint to-silver", bronze: "from-bronze via-bronze-tint to-bronze" } as const;
const ring = { gold: "ring-gold", silver: "ring-silver", bronze: "ring-bronze" } as const;

/** The medal picker under the coins. Static on the server, live (with `onSelect`) in the island. */
export function MedalList({ selected, onSelect }: { selected: number; onSelect?: (i: number) => void }) {
  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 md:px-8">
      <p className="text-sm font-semibold text-vault-muted">Choose a medal to see the competition and the result</p>
      <ul className="mt-3 grid list-none grid-cols-2 gap-2 p-0 lg:grid-cols-4">
        {medals.map((x, i) => (
          <li key={x.id}>
            <button
              type="button"
              aria-pressed={selected === i}
              onClick={onSelect && (() => onSelect(i))}
              className={cn(
                "flex h-full min-h-14 w-full items-center gap-2.5 rounded-xl bg-vault-edge/40 px-3 py-2.5 text-left text-[0.8125rem] leading-snug ring-1 ring-vault-edge transition-[transform,background-color] hover:bg-vault-edge active:scale-[0.98] md:text-sm",
                selected === i && cn("bg-vault-edge ring-2", ring[x.medal]),
              )}
            >
              <span aria-hidden="true" className={cn("size-6 shrink-0 rounded-full bg-linear-135 shadow-inner", dot[x.medal])} />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2">{x.name}</span>
                <span className="mt-0.5 block text-xs tabular-nums text-vault-muted">
                  {ordinal(x.rank)} of {x.field}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Coins beside the card on wide screens, above it on phones. Same box in the static HTML and the island. */
export function VaultLayout({ stage, card }: { stage?: React.ReactNode; card: React.ReactNode }) {
  return (
    <div className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 md:px-8 lg:mt-4 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-8">
      <div className="relative h-[min(42svh,20rem)] touch-pan-y lg:h-[34rem]">{stage}</div>
      <div aria-live="polite">{card}</div>
    </div>
  );
}
