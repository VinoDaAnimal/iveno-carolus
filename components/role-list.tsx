import { NOW, roleSpan, roles, type Role } from "@/lib/data";
import { cn } from "@/lib/utils";

const X0 = 2020;
const at = (y: number) => ((y - X0) / (NOW - X0)) * 100;
const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/);

export const panelId = (i: number) => `role-${i}`;

export function RoleDetail({ role }: { role: Role }) {
  return (
    <div className="grid gap-6 rounded-xl bg-card p-5 ring-1 ring-border md:grid-cols-[1fr_14rem] md:p-6">
      <ul className="m-0 grid list-none gap-3 p-0">
        {sentences(role.description).map((s) => (
          <li key={s} className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:size-2 before:rounded-full before:bg-primary">{s}</li>
        ))}
      </ul>
      <dl className="m-0 grid content-start gap-3 text-sm">
        <div><dt className="text-muted-foreground">Years</dt><dd className="m-0 font-semibold">{role.dates}</dd></div>
        <div><dt className="text-muted-foreground">Kind</dt><dd className="m-0 font-semibold">{role.track === "freelance" ? "Freelance, alongside employment" : "Employment"}</dd></div>
        <div><dt className="text-muted-foreground">Organisation</dt><dd className="m-0 font-semibold">{role.org}</dd></div>
      </dl>
    </div>
  );
}

type PanelRenderer = (i: number, isOpen: boolean, content: React.ReactNode) => React.ReactNode;

const staticPanel: PanelRenderer = (i, isOpen, content) =>
  isOpen ? <div id={panelId(i)} className="pb-6 md:pl-[calc(9rem+1.5rem)]">{content}</div> : null;

/** Roles as folded rows. Static on the server; the island passes `onToggle` and an animated panel. */
export function RoleList({ open, onToggle, panel = staticPanel }: { open: number[]; onToggle?: (i: number) => void; panel?: PanelRenderer }) {
  return (
    <ol className="mt-12 list-none p-0 [perspective:1400px]">
      {roles.map((r, i) => {
        const isOpen = open.includes(i);
        const [start, end] = roleSpan(r);
        return (
          <li key={r.title} className="border-t border-border last:border-b">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId(i)}
                onClick={onToggle && (() => onToggle(i))}
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-5 text-left md:grid-cols-[9rem_1fr_14rem_auto]"
              >
                <span className="text-sm tabular-nums text-muted-foreground md:text-base">{r.dates}</span>
                <span className="col-span-2 row-start-2 md:col-span-1 md:row-start-1">
                  <span className="block text-lg font-bold leading-snug group-hover:text-primary">{r.title}</span>
                  <span className="block font-normal text-muted-foreground">{r.org}</span>
                </span>
                <span aria-hidden="true" className="relative col-span-2 row-start-3 block h-2 rounded-full bg-muted md:col-span-1 md:row-start-1">
                  <span
                    className={cn("absolute inset-y-0 rounded-full", r.track === "freelance" ? "bg-role-freelance" : "bg-role-employed")}
                    style={{ left: `${at(start)}%`, width: `${at(end) - at(start)}%` }}
                  />
                </span>
                <span aria-hidden="true" className={cn("col-start-2 row-start-1 grid size-9 place-items-center rounded-full border border-border text-lg transition-transform md:col-start-4", isOpen && "rotate-45")}>+</span>
              </button>
            </h3>
            {panel(i, isOpen, <RoleDetail role={r} />)}
          </li>
        );
      })}
    </ol>
  );
}
