// Schematic drawings of what each project built. Decorative (aria-hidden); the text beside them carries
// the facts. Shapes draw in with the figure's scroll position (globals.css `.art`); no data is implied.

const label = "fill-muted-foreground text-[13px] font-semibold";
const box = "fill-card stroke-foreground";

function Node({ x, y, w, h, text, d }: { x: number; y: number; w: number; h: number; text: string; d: number }) {
  return (
    <g className="pop" style={{ "--d": d } as React.CSSProperties}>
      <rect x={x} y={y} width={w} height={h} rx={10} className={box} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="fill-foreground text-[13px] font-bold">{text}</text>
    </g>
  );
}

export function MalingaArt() {
  const links = ["M70 72 C 120 72, 130 120, 152 120", "M290 82 C 250 82, 240 120, 208 120", "M90 190 C 130 190, 140 140, 165 140"];
  return (
    <svg viewBox="0 0 360 240" className="art block w-full" aria-hidden="true">
      <rect x={8} y={8} width={344} height={224} rx={18} className="fill-none stroke-border" strokeDasharray="4 6" />
      <text x={20} y={28} className={label}>Secure local network</text>
      {links.map((d, i) => (
        <g key={d}>
          <path d={d} pathLength={1} className="draw fill-none stroke-border" strokeWidth={2} style={{ "--d": i } as React.CSSProperties} />
          <path d={d} pathLength={1} className="packet fill-none stroke-primary" strokeWidth={3} strokeLinecap="round" style={{ animationDelay: `${i * -0.8}s` }} />
        </g>
      ))}
      {/* local server */}
      <g className="pop" style={{ "--d": 0 } as React.CSSProperties}>
        <rect x={152} y={100} width={56} height={62} rx={8} className={box} strokeWidth={1.5} />
        {[114, 130, 146].map((y) => <line key={y} x1={162} x2={198} y1={y} y2={y} className="stroke-muted-foreground" strokeWidth={2} />)}
        <circle cx={194} cy={114} r={2.5} className="fill-primary" />
      </g>
      <text x={180} y={180} textAnchor="middle" className={label}>Server</text>
      {/* online store: phone */}
      <g className="pop" style={{ "--d": 1 } as React.CSSProperties}>
        <rect x={34} y={40} width={36} height={64} rx={8} className={box} strokeWidth={1.5} />
        <rect x={41} y={50} width={22} height={14} rx={3} className="fill-muted" />
        <rect x={41} y={68} width={22} height={4} rx={2} className="fill-muted" />
        <rect x={41} y={76} width={14} height={4} rx={2} className="fill-primary" />
      </g>
      <text x={52} y={120} textAnchor="middle" className={label}>Online store</text>
      {/* POS till */}
      <g className="pop" style={{ "--d": 2 } as React.CSSProperties}>
        <rect x={290} y={56} width={52} height={40} rx={6} className={box} strokeWidth={1.5} />
        <rect x={298} y={64} width={36} height={16} rx={2} className="fill-muted" />
        <path d="M304 96 L 300 112 L 332 112 L 328 96" className={box} strokeWidth={1.5} />
      </g>
      <text x={316} y={128} textAnchor="middle" className={label}>POS till</text>
      {/* admin laptop */}
      <g className="pop" style={{ "--d": 3 } as React.CSSProperties}>
        <rect x={40} y={164} width={52} height={34} rx={4} className={box} strokeWidth={1.5} />
        <rect x={47} y={171} width={38} height={4} rx={2} className="fill-primary" />
        <rect x={47} y={179} width={26} height={4} rx={2} className="fill-muted" />
        <path d="M32 204 L 100 204 L 94 198 L 38 198 Z" className={box} strokeWidth={1.5} />
      </g>
      <text x={66} y={222} textAnchor="middle" className={label}>Admin</text>
    </svg>
  );
}

export function PipelineArt() {
  // One path snakes through the six stages; blocks ride along it.
  const route = "M60 70 H 180 H 300 V 170 H 180 H 60";
  const stages = [
    { x: 20, y: 50, t: "URLs" }, { x: 140, y: 50, t: "Scrape" }, { x: 260, y: 50, t: "Clean" },
    { x: 260, y: 150, t: "Structure" }, { x: 140, y: 150, t: "LLMs" }, { x: 20, y: 150, t: "Dashboards" },
  ];
  return (
    <svg viewBox="0 0 360 240" className="art block w-full" aria-hidden="true">
      <path d={route} pathLength={1} className="draw fill-none stroke-border" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={route} pathLength={1} className="packet fill-none stroke-primary" strokeWidth={8} style={{ animationDelay: `${i * -0.7}s` }} />
      ))}
      {stages.map((s, i) => <Node key={s.t} x={s.x} y={s.y} w={80} h={40} text={s.t} d={i} />)}
      <text x={180} y={124} textAnchor="middle" className={label}>collect, clean, structure, mine</text>
    </svg>
  );
}

export function AfricaBitesArt() {
  const tiles = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 360 240" className="art block w-full" aria-hidden="true">
      {/* source pages */}
      {[0, 1, 2].map((i) => (
        <g key={i} className="pop" style={{ "--d": i } as React.CSSProperties}>
          <rect x={18 + i * 8} y={46 + i * 10} width={70} height={90} rx={6} className={box} strokeWidth={1.5} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={28 + i * 8} y={60 + i * 10 + k * 12} width={k % 2 ? 36 : 50} height={4} rx={2} className="fill-muted" />)}
        </g>
      ))}
      <text x={60} y={176} textAnchor="middle" className={label}>Recipe sources</text>
      <path d="M112 100 H 150" pathLength={1} className="draw fill-none stroke-primary" strokeWidth={2} markerEnd="url(#ab-arrow)" />
      <defs>
        <marker id="ab-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M0 0 L10 5 L0 10 Z" className="fill-primary" /></marker>
      </defs>
      <text x={131} y={90} textAnchor="middle" className={label}>scrape</text>
      {/* the site */}
      <rect x={160} y={30} width={184} height={170} rx={10} className={box} strokeWidth={1.5} />
      <path d="M160 52 H 344" className="stroke-border" />
      {[172, 182, 192].map((x) => <circle key={x} cx={x} cy={41} r={3} className="fill-muted" />)}
      {tiles.map((i) => {
        const x = 172 + (i % 3) * 56, y = 62 + Math.floor(i / 3) * 66;
        return (
          <g key={i} className="pop" style={{ "--d": i + 2 } as React.CSSProperties}>
            <rect x={x} y={y} width={48} height={56} rx={6} className="fill-muted" />
            <rect x={x + 6} y={y + 6} width={36} height={24} rx={4} className={i === 4 ? "fill-foreground" : "fill-card"} />
            {i === 4 && <path d={`M${x + 21} ${y + 12} L ${x + 30} ${y + 18} L ${x + 21} ${y + 24} Z`} className="fill-card" />}
            <rect x={x + 6} y={y + 36} width={30} height={4} rx={2} className="fill-card" />
            <rect x={x + 6} y={y + 44} width={20} height={4} rx={2} className="fill-card" />
          </g>
        );
      })}
      <text x={252} y={222} textAnchor="middle" className={label}>Recipes, history and video</text>
    </svg>
  );
}

export function TreeArt() {
  // Illustrative binary search tree: values are placeholders for the structure, not data.
  const nodes = [
    { x: 180, y: 40, v: 8, l: 0 }, { x: 100, y: 105, v: 3, l: 1 }, { x: 260, y: 105, v: 10, l: 1 },
    { x: 60, y: 170, v: 1, l: 2 }, { x: 140, y: 170, v: 6, l: 2 }, { x: 300, y: 170, v: 14, l: 2 },
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (
    <svg viewBox="0 0 360 240" className="art block w-full" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <path key={i} d={`M${nodes[a].x} ${nodes[a].y} L ${nodes[b].x} ${nodes[b].y}`} pathLength={1} className="draw fill-none stroke-muted-foreground" strokeWidth={2} style={{ "--d": nodes[b].l } as React.CSSProperties} />
      ))}
      {nodes.map((n) => (
        <g key={n.v} className="pop" style={{ "--d": n.l * 2 } as React.CSSProperties}>
          <circle cx={n.x} cy={n.y} r={20} className={n.l === 0 ? "fill-primary" : box} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" className={n.l === 0 ? "fill-primary-foreground text-[14px] font-bold" : "fill-foreground text-[14px] font-bold"}>{n.v}</text>
        </g>
      ))}
      <text x={180} y={224} textAnchor="middle" className={label}>Algorithms and data structures in C</text>
    </svg>
  );
}
