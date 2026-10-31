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

// Literal class names so Tailwind generates them; one per folder.
const shows = [
  "group-has-[#skill-0:checked]/skills:block", "group-has-[#skill-1:checked]/skills:block", "group-has-[#skill-2:checked]/skills:block",
  "group-has-[#skill-3:checked]/skills:block", "group-has-[#skill-4:checked]/skills:block", "group-has-[#skill-5:checked]/skills:block",
];

// Box faces, centred on the folder: front carries the name, top and right give it depth.
const face = "absolute left-0 top-0 transition-colors";
const front = `${face} flex h-(--h) w-(--w) items-center justify-end rounded-sm bg-secondary pr-3 pl-3 ring-1 ring-border [transform:translateZ(calc(var(--d)/2))] peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:ring-primary peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring`;
const top = `${face} h-(--d) w-(--w) bg-card ring-1 ring-border [top:calc((var(--h)-var(--d))/2)] [transform:rotateX(90deg)_translateZ(calc(var(--h)/2))] peer-checked:bg-[color-mix(in_oklab,var(--primary)_35%,var(--card))]`;
const side = `${face} h-(--h) w-(--d) bg-tick [left:calc((var(--w)-var(--d))/2)] [transform:rotateY(90deg)_translateZ(calc(var(--w)/2))] peer-checked:bg-[color-mix(in_oklab,var(--primary)_60%,black)]`;

/**
 * A filing cabinet pile: one folder per skill group, each lower folder a step further right so every
 * name stays visible on its front edge. Radio inputs make it interactive with no JavaScript: the
 * checked folder slides out towards you and its panel shows.
 */
export function Skills() {
  const n = skills.length;
  return (
    <section id="skills" aria-labelledby="skills-h" className="group/skills overflow-x-clip border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
        <h2 id="skills-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Skills</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">Six folders of tools. Pull one out to see where it shows up in the work above.</p>
        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="sr-only">Skill folders</legend>
            <div className="grid place-items-center py-6 [perspective:1100px] [--d:5.5rem] [--h:2.6rem] [--s:0.7rem] [--w:12.75rem] sm:py-10 sm:[--d:7rem] sm:[--h:2.9rem] sm:[--s:1.4rem] sm:[--w:15rem]">
              <div
                className="relative [transform-style:preserve-3d] [transform:rotateX(22deg)_rotateY(-26deg)]"
                style={{ width: `calc(var(--w) + ${n - 1} * var(--s))`, height: `calc(${n} * var(--h))` }}
              >
                {skills.map((g, i) => {
                  const id = `skill-${i}`;
                  return (
                    <label
                      key={g.group}
                      htmlFor={id}
                      style={{ "--i": i } as React.CSSProperties}
                      className={cn(
                        "absolute left-0 top-0 h-(--h) w-(--w) cursor-pointer [transform-style:preserve-3d]",
                        "[transform:translate3d(calc(var(--i)*var(--s)),calc(var(--i)*var(--h)),0)]",
                        "transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
                        "hover:[transform:translate3d(calc(var(--i)*var(--s)+0.6rem),calc(var(--i)*var(--h)),0.2rem)]",
                        // Out to the side, barely forward, so it never covers the folder above.
                        "has-[:checked]:[transform:translate3d(calc(var(--i)*var(--s)+2.4rem),calc(var(--i)*var(--h)),0.5rem)]",
                      )}
                    >
                      <input type="radio" name="skill" id={id} defaultChecked={i === 0} className="peer sr-only" />
                      <span aria-hidden="true" className={top} />
                      <span aria-hidden="true" className={side} />
                      <span className={front}>
                        {/* folder tab */}
                        <span aria-hidden="true" className="absolute -top-1.5 left-3 h-1.5 w-9 rounded-t-sm bg-inherit" />
                        <span className="truncate text-[0.8rem] font-bold sm:text-sm">{g.group}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </fieldset>
          <div>
            {skills.map((g, i) => (
              <div key={g.group} className={cn("hidden", shows[i])}>
                <h3 className="text-2xl font-bold tracking-[-0.02em]">{g.group}</h3>
                <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
                  {g.items.map((s) => (
                    <li key={s} className="rounded-lg bg-background px-3 py-1.5 text-sm font-semibold ring-1 ring-border">{s}</li>
                  ))}
                </ul>
                {g.items.some((s) => mentions(s).length) && (
                  <>
                    <h4 className="mt-6 text-sm font-semibold text-muted-foreground">Where it shows up on this page</h4>
                    <dl className="mt-2 grid gap-2">
                      {g.items.map((s) => ({ s, at: mentions(s) })).filter((x) => x.at.length).map(({ s, at }) => (
                        <div key={s} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-border pt-2 text-sm sm:grid-cols-[8rem_1fr]">
                          <dt className="font-semibold">{s}</dt>
                          <dd className="m-0 text-muted-foreground">{at.join(", ")}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
