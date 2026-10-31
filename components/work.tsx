import { CountUp } from "@/components/count-up";
import { AfricaBitesArt, MalingaArt, PipelineArt, TreeArt } from "@/components/work-art";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";

const art: Record<string, React.ReactNode> = {
  malinga: <MalingaArt />,
  cavell: <PipelineArt />,
  "africa-bites": <AfricaBitesArt />,
  wethinkcode: <TreeArt />,
};

export function Work() {
  return (
    <section id="work" aria-labelledby="work-h" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <h2 id="work-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Work</h2>
      <p className="mt-3 max-w-xl text-muted-foreground">Four builds, from a first semester of C to a production system in a shop.</p>
      <ol className="mt-10 grid list-none gap-6 p-0 md:gap-10">
        {projects.map((p, i) => (
          <li key={p.id} id={p.id} className="grid items-center gap-5 rounded-3xl bg-card p-4 ring-1 ring-border md:grid-cols-2 md:gap-10 md:p-8">
            <figure className={cn("m-0 rounded-2xl bg-background p-3 md:p-5", i % 2 && "md:order-2")}>
              {art[p.id]}
              {p.figure && (
                <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3">
                  <CountUp to={p.figure.value} className="text-2xl font-extrabold tabular-nums tracking-[-0.02em] text-primary md:text-3xl" />
                  <span className="text-sm font-semibold text-muted-foreground">{p.figure.label}</span>
                </figcaption>
              )}
            </figure>
            <div className="px-1 pb-2 md:px-0">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="tabular-nums">{p.dates}</span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">{p.status}</span>
              </p>
              <h3 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">{p.name}</h3>
              {p.org && <p className="mt-1 font-semibold text-muted-foreground">{p.org}</p>}
              <p className="mt-3 max-w-prose">{p.description}</p>
              <ul className="mt-4 flex list-none flex-wrap gap-1.5 p-0">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">{s}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
