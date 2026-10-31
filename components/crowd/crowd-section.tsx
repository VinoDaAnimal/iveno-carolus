import { CrowdController } from "@/components/crowd/crowd-controller";
import { FieldStrip } from "@/components/field-strip";
import { MedalLabel } from "@/components/medal-label";
import { medalsByFinish } from "@/lib/data";
import { ordinal, slotCentre, topPct } from "@/lib/rank";

const totalEntrants = medalsByFinish.reduce((s, f) => s + f.field, 0);
const card = "max-w-sm rounded-xl bg-card/90 p-5 shadow-sm ring-1 ring-border backdrop-blur-md md:p-6";
const step = "h-svh snap-start snap-always px-4 pt-6 md:px-10 md:pt-10";

export function CrowdSection() {
  return (
    <section id="proof" aria-labelledby="proof-h" className="relative bg-stage">
      <div className="sticky top-0 h-svh" aria-hidden="true">
        <canvas data-crowd-canvas className="block size-full" />
      </div>
      <div className="relative -mt-[100svh]">
        <div data-step="0" className={step}>
          <div data-card className={`${card} max-w-md`}>
            <h2 id="proof-h" className="text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">Where he finished</h2>
            <p className="mt-3 text-muted-foreground">
              Every entrant in the eight Zindi competitions where Iveno won a medal: {totalEntrants.toLocaleString("en-US")} blocks, one per place on the final leaderboard, first place in the front row. Eight of them are his. Scroll once per competition.
            </p>
          </div>
        </div>
        {medalsByFinish.map((f, i) => (
          <div key={f.id} data-step={i + 1} className={step}>
            <article data-card className={card}>
              <MedalLabel medal={f.medal} className="text-sm text-muted-foreground" />
              <h3 className="mt-2 text-xl font-bold leading-tight tracking-[-0.01em]">{f.name}</h3>
              <p className="mt-3 text-[clamp(2.75rem,8vw,4rem)] font-extrabold leading-none tracking-[-0.04em]">
                {f.rank}
                <span className="ml-1 text-lg font-semibold tracking-normal text-muted-foreground">of {f.field}</span>
              </p>
              <p className="mt-1 font-semibold">Top {topPct(f.rank, f.field)}% of the final leaderboard</p>
              <FieldStrip field={f.field} position={slotCentre(f.rank, f.field)} medal={f.medal} className="mt-4" />
              <p className="mt-1 flex justify-between text-xs text-muted-foreground"><span>1st</span><span>{ordinal(f.field)}</span></p>
              {f.pending && <p className="mt-2 text-sm text-muted-foreground">{f.pending}</p>}
            </article>
          </div>
        ))}
      </div>
      <div className="sr-only"><table>
        <caption>Zindi medals: finishing rank, number of entrants, and share of the field at or above that rank</caption>
        <thead>
          <tr><th scope="col">Competition</th><th scope="col">Medal</th><th scope="col">Rank</th><th scope="col">Entrants</th><th scope="col">Top %</th></tr>
        </thead>
        <tbody>
          {medalsByFinish.map((f) => (
            <tr key={f.id}><th scope="row">{f.name}</th><td>{f.medal}</td><td>{f.rank}</td><td>{f.field}</td><td>{topPct(f.rank, f.field)}%</td></tr>
          ))}
        </tbody>
      </table></div>
      <CrowdController fields={medalsByFinish.map(({ medal, rank, field }) => ({ medal, rank, field }))} />
    </section>
  );
}
