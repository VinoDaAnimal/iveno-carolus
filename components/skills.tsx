import { currentRoleTools, person, projects, roles, skills } from "@/lib/data";
import { cn } from "@/lib/utils";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Where a skill is named in the roles and projects on this page (a real join, nothing inferred). */
function mentions(skill: string) {
  const re = new RegExp(`\\b${escape(skill)}`, "i");
  return [
    ...(currentRoleTools.some((t) => re.test(t)) ? [`${person.currentOrg} (current role)`] : []),
    ...roles.filter((r) => re.test(r.description) || re.test(r.title)).map((r) => r.org),
    ...projects.filter((p) => p.stack.some((s) => re.test(s)) || re.test(p.description)).map((p) => p.name),
  ].filter((v, i, a) => a.indexOf(v) === i);
}

// Bottom of the stack first: tools at the base, analysis on top.
const layers = [...skills].reverse();
// Literal class names so Tailwind generates them; one per layer.
const shows = [
  "group-has-[#skill-0:checked]/skills:block", "group-has-[#skill-1:checked]/skills:block", "group-has-[#skill-2:checked]/skills:block",
  "group-has-[#skill-3:checked]/skills:block", "group-has-[#skill-4:checked]/skills:block", "group-has-[#skill-5:checked]/skills:block",
];
// Literal so Tailwind sees every class: the chip for the checked layer turns primary.
const picked = [
  "group-has-[#skill-0:checked]/skills:bg-primary group-has-[#skill-0:checked]/skills:text-primary-foreground group-has-[#skill-0:checked]/skills:ring-primary",
  "group-has-[#skill-1:checked]/skills:bg-primary group-has-[#skill-1:checked]/skills:text-primary-foreground group-has-[#skill-1:checked]/skills:ring-primary",
  "group-has-[#skill-2:checked]/skills:bg-primary group-has-[#skill-2:checked]/skills:text-primary-foreground group-has-[#skill-2:checked]/skills:ring-primary",
  "group-has-[#skill-3:checked]/skills:bg-primary group-has-[#skill-3:checked]/skills:text-primary-foreground group-has-[#skill-3:checked]/skills:ring-primary",
  "group-has-[#skill-4:checked]/skills:bg-primary group-has-[#skill-4:checked]/skills:text-primary-foreground group-has-[#skill-4:checked]/skills:ring-primary",
  "group-has-[#skill-5:checked]/skills:bg-primary group-has-[#skill-5:checked]/skills:text-primary-foreground group-has-[#skill-5:checked]/skills:ring-primary",
];

/**
 * An isometric stack, one slab per skill group. Radio inputs make it interactive with no JavaScript:
 * the checked slab slides out and its panel shows.
 */
export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-h" className="group/skills overflow-x-clip border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h2 id="skills-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Skills</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">The stack, layer by layer. Pick a layer to pull it out and see where it shows up in the work above.</p>
        <div className="mt-8 grid items-center gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <fieldset className="m-0 border-0 p-0">
            <legend className="sr-only">Skill layers</legend>
            <div className="grid h-[19rem] place-items-center [perspective:1600px] sm:h-[24rem]">
              <div className="relative size-[11.5rem] [transform:rotateX(58deg)_rotateZ(-45deg)] [transform-style:preserve-3d] sm:size-[14rem]">
                {layers.map((g, i) => {
                  const id = `skill-${i}`;
                  return (
                    <label
                      key={g.group}
                      htmlFor={id}
                      style={{ "--z": `${i * 1.9}rem` } as React.CSSProperties}
                      className={cn(
                        "group/slab absolute inset-0 cursor-pointer [transform-style:preserve-3d] [transform:translateZ(var(--z))]",
                        "transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
                        "hover:[transform:translateZ(calc(var(--z)+0.6rem))]",
                        "has-[:checked]:[transform:translateZ(calc(var(--z)+1.2rem))_translate(2.6rem,2.6rem)]",
                      )}
                    >
                      <input type="radio" name="skill" id={id} defaultChecked={i === layers.length - 1} className="peer sr-only" />
                      {/* top face */}
                      <span className="absolute inset-0 grid place-items-center rounded-md bg-secondary px-3 text-center text-[0.8rem] font-bold leading-tight text-foreground ring-1 ring-border peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-3 peer-focus-visible:outline-ring sm:text-sm">
                        {g.group}
                      </span>
                      {/* front and right edges, folded down to give the slab depth */}
                      <span className="absolute inset-x-0 bottom-0 h-3 origin-bottom bg-border [transform:rotateX(-90deg)] peer-checked:bg-[color-mix(in_oklab,var(--primary)_70%,black)]" />
                      <span className="absolute inset-y-0 right-0 w-3 origin-right bg-tick [transform:rotateY(90deg)] peer-checked:bg-[color-mix(in_oklab,var(--primary)_55%,black)]" />
                    </label>
                  );
                })}
              </div>
            </div>
            {/* The same radios by name: one tap for any layer, even ones buried in the stack. */}
            <div className="flex flex-wrap justify-center gap-2" aria-hidden="true">
              {layers.map((g, i) => ({ g, i })).reverse().map(({ g, i }) => (
                <label key={g.group} htmlFor={`skill-${i}`} className={cn("cursor-pointer rounded-full bg-background px-3 py-2 text-sm font-semibold ring-1 ring-border", picked[i])}>
                  {g.group}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            {layers.map((g, i) => (
              <div key={g.group} className={cn("hidden", shows[i])}>
                <h3 className="text-2xl font-bold tracking-[-0.02em]">{g.group}</h3>
                <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
                  {g.items.map((s) => (
                    <li key={s} className="rounded-lg bg-background px-3 py-1.5 text-sm font-semibold ring-1 ring-border">{s}</li>
                  ))}
                </ul>
                <h4 className="mt-6 text-sm font-semibold text-muted-foreground">Where it shows up on this page</h4>
                <dl className="mt-2 grid gap-2">
                  {g.items.map((s) => ({ s, at: mentions(s) })).filter((x) => x.at.length).map(({ s, at }) => (
                    <div key={s} className="grid grid-cols-[7.5rem_1fr] gap-3 border-t border-border pt-2 text-sm">
                      <dt className="font-semibold">{s}</dt>
                      <dd className="m-0 text-muted-foreground">{at.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
