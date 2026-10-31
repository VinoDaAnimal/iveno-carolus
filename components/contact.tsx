import portrait from "@/public/images/iveno-carolus-portrait-cap-bw-960.jpg";
import { CopyEmail } from "@/components/copy-email";
import { Year } from "@/components/year";
import { contact, person } from "@/lib/data";

const row = "flex min-h-16 items-center justify-between gap-3 rounded-xl bg-vault-edge/30 px-4 py-3 ring-1 ring-vault-edge transition-colors hover:bg-vault-edge/60";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h" className="bg-vault text-vault-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-20 md:px-8 lg:grid-cols-[auto_1fr] lg:gap-14 lg:pt-28">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export serves images unoptimized */}
        <img
          src={portrait.src}
          width={portrait.width}
          height={portrait.height}
          alt="Iveno Carolus"
          loading="lazy"
          className="size-28 rounded-2xl object-cover ring-1 ring-vault-edge sm:size-36 lg:size-64"
        />
        <div className="min-w-0">
          <h2 id="contact-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Get in touch</h2>
          <p className="mt-3 max-w-xl text-vault-muted">
            {person.name}, {person.role}. {person.currentRole} at {person.currentOrg}.
          </p>
          <ul className="mt-8 grid list-none gap-2 p-0 sm:grid-cols-2">
            <li className="sm:col-span-2">
              <div className={row}>
                <a href={`mailto:${contact.email}`} className="min-w-0 flex-1 py-1">
                  <span className="block text-xs font-semibold text-vault-muted">Email</span>
                  <span className="block text-base font-bold [overflow-wrap:anywhere] sm:text-xl">{contact.email}</span>
                </a>
                <CopyEmail email={contact.email} />
              </div>
            </li>
            <li>
              <a href={contact.linkedin} className={row}>
                <span>
                  <span className="block text-xs font-semibold text-vault-muted">LinkedIn</span>
                  <span className="block font-bold">Iveno Carolus</span>
                </span>
                <span aria-hidden="true" className="text-vault-muted">↗</span>
              </a>
            </li>
            <li>
              <a href={contact.github} className={row}>
                <span>
                  <span className="block text-xs font-semibold text-vault-muted">GitHub</span>
                  <span className="block font-bold">VinoDaAnimal</span>
                </span>
                <span aria-hidden="true" className="text-vault-muted">↗</span>
              </a>
            </li>
            <li className="sm:col-span-2">
              <div className={row}>
                <span>
                  <span className="block text-xs font-semibold text-vault-muted">Phone</span>
                  <span className="block font-bold">On request</span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-vault-edge px-4 py-6 text-sm text-vault-muted md:px-8">
        <span>© <Year buildYear={new Date().getFullYear()} /> {person.name}. All rights reserved.</span>
        <a href="#main" className="font-semibold text-vault-foreground underline underline-offset-4">Back to top</a>
      </footer>
    </section>
  );
}
