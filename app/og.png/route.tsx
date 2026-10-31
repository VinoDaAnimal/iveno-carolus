import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { medalsByFinish, person } from "@/lib/data";
import { slotCentre } from "@/lib/rank";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

// Satori can't read CSS variables, so the OG card restates the token values it needs.
const ink = "rgb(15,27,45)";
const muted = "rgb(74,88,104)";
const paper = "rgb(244,246,248)";
const tick = "rgb(185,194,205)";
const medal = { gold: "rgb(168,122,18)", silver: "rgb(90,115,147)", bronze: "rgb(154,79,37)" };

// Exported as out/og.png; a file-convention opengraph-image has no extension, which Pages serves untyped.
export async function GET() {
  const photo = await readFile(join(process.cwd(), "public/images/iveno-carolus-portrait-suit-800.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: paper, padding: 64, color: ink }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs a plain img */}
          <img src={src} width={168} height={168} style={{ borderRadius: 999 }} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{person.name}</div>
            <div style={{ fontSize: 36, marginTop: 12 }}>{person.role}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 56, gap: 14 }}>
          {medalsByFinish.slice(0, 5).map((f) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 300, fontSize: 20, color: muted, display: "flex" }}>{f.rank} of {f.field}</div>
              <div style={{ position: "relative", display: "flex", flex: 1, height: 18, background: tick, borderRadius: 9 }}>
                <div style={{ position: "absolute", left: `${slotCentre(f.rank, f.field)}%`, top: -5, width: 28, height: 28, marginLeft: -14, borderRadius: 999, background: medal[f.medal], border: `4px solid ${paper}` }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", fontSize: 22, color: muted, display: "flex" }}>Zindi medal finishes, first place on the left</div>
      </div>
    ),
    size,
  );
}
