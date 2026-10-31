import { projects } from "@/lib/data";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-h" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <h2 id="work-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Work</h2>
      <ol className="mt-10 list-none p-0">
        {projects.map((p) => (
          <li key={p.name} id={p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="grid gap-4 border-t border-border py-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
            <div>
              <h3 className="text-2xl font-bold leading-tight tracking-[-0.02em]">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {p.org ? `${p.org}, ` : ""}{p.dates}. {p.status}
              </p>
              {p.figure && (
                <p className="mt-6">
                  <span className="block text-[clamp(3rem,8vw,5.5rem)] font-extrabold leading-none tracking-[-0.05em] text-primary">{p.figure.value}</span>
                  <span className="mt-1 block font-semibold">{p.figure.label}</span>
                </p>
              )}
            </div>
            <div>
              <p className="m-0 max-w-prose">{p.description}</p>
              <p className="mt-4 text-sm text-muted-foreground">{p.stack.join(", ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
