import portrait from "@/public/images/iveno-carolus-portrait-suit-800.jpg";
import { CareerChart } from "@/components/career-chart";
import { contact, person } from "@/lib/data";

export function Hero() {
  return (
    <header className="mx-auto grid max-w-6xl snap-start gap-8 px-4 pb-12 pt-14 md:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-16 lg:pt-24">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export serves images unoptimized; next/image would only add client JS */}
      <img
        src={portrait.src}
        width={portrait.width}
        height={portrait.height}
        alt="Iveno Carolus"
        fetchPriority="high"
        className="size-28 rounded-full object-cover lg:col-start-2 lg:row-start-1 lg:size-60"
      />
      <div className="lg:row-start-1">
        <h1 className="animate-rise text-[clamp(3.25rem,10vw,7.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
          {person.name}
        </h1>
        <p className="mt-3 text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold">{person.role}</p>
        <p className="mt-4 max-w-xl text-muted-foreground">{person.lede}</p>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Now {person.currentRole} at {person.currentOrg}.
        </p>
        <nav aria-label="Contact" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          <a href="#contact" className="text-primary underline underline-offset-4">Contact</a>
          <a href={contact.github} className="text-primary underline underline-offset-4">GitHub</a>
          <a href={contact.linkedin} className="text-primary underline underline-offset-4">LinkedIn</a>
        </nav>
      </div>
      <div className="lg:col-span-2">
        <CareerChart />
      </div>
    </header>
  );
}
