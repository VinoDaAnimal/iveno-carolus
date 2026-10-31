import { NOW, datedEntries, roleSpan, roles } from "@/lib/data";
import { cn } from "@/lib/utils";

const X0 = 2019.7;
const X1 = NOW + 0.15;
const at = (year: number) => ((year - X0) / (X1 - X0)) * 100;
const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const medalFill = { gold: "bg-gold", silver: "bg-silver", bronze: "bg-bronze" } as const;

export function CareerChart() {
  const rows = [...roles].sort((a, b) => a.from - b.from || (a.to ?? 9999) - (b.to ?? 9999));
  return (
    <figure className="m-0">
      <div className="relative" aria-hidden="true">
        <div className="pointer-events-none absolute inset-0 bottom-6">
          {YEARS.map((y) => (
            <span key={y} className="absolute inset-y-0 w-px bg-border" style={{ left: `${at(y)}%` }} />
          ))}
        </div>
        <ol className="relative m-0 list-none p-0">
          {rows.map((r, i) => {
            const [start, end] = roleSpan(r);
            const late = at(start) > 55;
            return (
              <li key={r.title} className="relative h-8">
                <span
                  className={cn("absolute top-0 whitespace-nowrap text-[0.8125rem] font-semibold leading-4", late && "-translate-x-full")}
                  style={{ left: `${late ? at(end) : at(start)}%` }}
                >
                  {r.org}
                </span>
                <span
                  className={cn(
                    "absolute top-[1.125rem] h-[7px] origin-left animate-grow rounded-full",
                    r.track === "freelance" ? "bg-role-freelance" : "bg-role-employed",
                  )}
                  style={{ left: `${at(start)}%`, width: `${at(end) - at(start)}%`, animationDelay: `${0.15 + i * 0.07}s` }}
                />
              </li>
            );
          })}
          <li className="relative h-8">
            <span className="absolute top-0 text-[0.8125rem] leading-4 text-muted-foreground">Dated Zindi entries</span>
            {datedEntries.map((e) => (
              <span
                key={e.label}
                className={cn(
                  "absolute top-[1.0625rem] size-2.5 -translate-x-1/2 rounded-full ring-2 ring-background",
                  e.medal ? medalFill[e.medal] : "bg-card outline outline-[1.5px] outline-foreground",
                )}
                style={{ left: `${at(e.at)}%` }}
              />
            ))}
          </li>
        </ol>
        <div className="relative h-6 border-t border-border text-xs text-muted-foreground">
          {YEARS.map((y) => (
            <span key={y} className="absolute top-1 -translate-x-1/2 tabular-nums" style={{ left: `${at(y)}%` }}>
              {y}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="mt-2 max-w-prose text-sm text-muted-foreground">
        Roles by year, 2020 to today. Most dates are whole years, so roles that change mid-year overlap; Spirit Invest ends early 2026, when SeedGrowth Analytics begins. Freelance work (grey) runs alongside the full-time roles from 2024; dots are Zindi entries with a known month.
      </figcaption>
      <div className="sr-only"><table>
        <caption>Career timeline</caption>
        <thead>
          <tr><th scope="col">Role</th><th scope="col">Organisation</th><th scope="col">Years</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.title}><td>{r.title}</td><td>{r.org}</td><td>{r.dates}</td></tr>
          ))}
          {datedEntries.map((e) => (
            <tr key={e.label}><td colSpan={2}>{e.label}</td><td>Zindi entry</td></tr>
          ))}
        </tbody>
      </table></div>
    </figure>
  );
}
