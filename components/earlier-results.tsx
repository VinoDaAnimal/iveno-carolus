import { FieldStrip } from "@/components/field-strip";
import { unranked } from "@/lib/data";

export function EarlierResults() {
  return (
    <section aria-labelledby="earlier-h" className="snap-start border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <h2 id="earlier-h" className="text-2xl font-bold tracking-[-0.02em]">Other ranked entries</h2>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Two more Zindi results with a published percentile but no medal. The rank itself wasn’t recorded, so the marker sits at the percentile.
        </p>
        <ul className="mt-8 grid list-none gap-8 p-0 md:grid-cols-2">
          {unranked.map((u) => (
            <li key={u.id}>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-muted-foreground">
                Top {u.topPct}% ({u.field} {u.unit}), {u.note}
              </p>
              <FieldStrip field={u.field} position={u.topPct} className="mt-3" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
