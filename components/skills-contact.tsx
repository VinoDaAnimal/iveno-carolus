import { Year } from "@/components/year";
import { contact, person, skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-h" className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h2 id="skills-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Skills</h2>
        <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <div key={s.group}>
              <dt className="font-bold">{s.group}</dt>
              <dd className="m-0 mt-1 text-muted-foreground">{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <>
      <section id="contact" aria-labelledby="contact-h" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h2 id="contact-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Contact</h2>
        <p className="mt-8">
          <a href={`mailto:${contact.email}`} className="break-all text-[clamp(1.5rem,4.5vw,3rem)] font-bold tracking-[-0.02em] text-primary underline underline-offset-[0.15em]">
            {contact.email}
          </a>
        </p>
        <ul className="mt-6 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-lg">
          <li>Phone on request</li>
          <li><a href={contact.linkedin} className="font-semibold text-primary underline underline-offset-4">LinkedIn</a></li>
          <li><a href={contact.github} className="font-semibold text-primary underline underline-offset-4">GitHub</a></li>
        </ul>
      </section>
      <footer className="mx-auto max-w-6xl px-4 pb-12 text-sm text-muted-foreground md:px-8">
        © <Year buildYear={new Date().getFullYear()} /> {person.name}. All rights reserved.
      </footer>
    </>
  );
}
