import { FieldStrip } from "@/components/field-strip";
import { MedalLabel } from "@/components/medal-label";
import type { MedalResult } from "@/lib/data";
import { ordinal, slotCentre, topPct } from "@/lib/rank";

/** The glass card's content. Static for the first medal on the server; animated per medal in the island. */
export function MedalDetail({ f }: { f: MedalResult }) {
  return (
    <>
      <MedalLabel medal={f.medal} className="text-sm text-vault-muted" />
      <h3 className="mt-1 text-lg font-bold leading-tight md:text-2xl">{f.name}</h3>
      <p className="mt-1.5 text-sm text-vault-muted md:text-base">{f.question}</p>
      <dl className="mt-3 grid grid-cols-3 gap-3 border-y border-vault-edge py-2.5 md:mt-4 md:py-3">
        <div><dt className="text-xs text-vault-muted">Rank</dt><dd className="m-0 text-xl font-extrabold tracking-[-0.03em] md:text-3xl">{ordinal(f.rank)}</dd></div>
        <div><dt className="text-xs text-vault-muted">Entrants</dt><dd className="m-0 text-xl font-extrabold tracking-[-0.03em] md:text-3xl">{f.field}</dd></div>
        <div><dt className="text-xs text-vault-muted">Top</dt><dd className="m-0 text-xl font-extrabold tracking-[-0.03em] md:text-3xl">{topPct(f.rank, f.field)}%</dd></div>
      </dl>
      <FieldStrip field={f.field} position={slotCentre(f.rank, f.field)} medal={f.medal} className="mt-3 [--background:var(--vault)] [--foreground:var(--vault-foreground)] [--tick:var(--vault-edge)]" />
      {f.note && <p className="mt-2 text-xs text-vault-muted">{f.note}</p>}
      <p className="mt-1 flex justify-between text-xs text-vault-muted"><span>1st</span><span>{ordinal(f.field)}</span></p>
      <p className="mt-2 text-sm text-vault-muted md:mt-3">{f.prize.startsWith("Knowledge") ? f.prize : `Prize pool: ${f.prize}`}</p>
      <p className="mt-0.5 text-xs text-vault-muted md:text-sm">{f.tags.join(", ")}</p>
      <a href={f.url} className="mt-1 inline-flex min-h-11 items-center font-semibold text-vault-foreground underline underline-offset-4">
        View the competition on Zindi
      </a>
    </>
  );
}

export const glassCard = "relative rounded-2xl bg-vault-glass p-4 text-vault-foreground ring-1 ring-vault-edge backdrop-blur-xl md:p-6";
