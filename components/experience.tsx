import { ExperienceIsland } from "@/components/islands";
import { RoleList } from "@/components/role-list";
import { about } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-h" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <h2 id="exp-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Experience</h2>
      <div className="mt-6 grid max-w-3xl gap-4 text-muted-foreground">
        {about.map((p) => <p key={p.slice(0, 24)} className="m-0">{p}</p>)}
      </div>
      <ExperienceIsland>
        <RoleList open={[0]} />
      </ExperienceIsland>
    </section>
  );
}
