import { existsSync } from "node:fs";
import { join } from "node:path";
import { VaultIsland } from "@/components/islands";
import { MedalList, VaultStage } from "@/components/vault/medal-list";
import { basePath } from "@/lib/site";

// Drop the banner into public/images and it appears on the next build.
const BANNER = "images/zindi-on-the-leaderboard.png";
const hasBanner = existsSync(join(process.cwd(), "public", BANNER));

export function VaultSection() {
  return (
    <section id="vault" aria-labelledby="vault-h" className="bg-vault pb-16 pt-16 text-vault-foreground md:pt-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {hasBanner && (
          // eslint-disable-next-line @next/next/no-img-element -- static export serves images unoptimized
          <img src={`${basePath}/${BANNER}`} alt="Zindi challenge: on the leaderboard." width={1584} height={396} loading="lazy" className="mb-10 h-auto w-full rounded-lg" />
        )}
        <h2 id="vault-h" className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">Zindi medal vault</h2>
        <p className="mt-3 max-w-xl text-vault-muted">
          Three golds, two silvers, three bronzes, each engraved with the finishing rank and the size of the field. Pick a coin to turn it over.
        </p>
      </div>
      <VaultIsland>
        <VaultStage />
        <MedalList />
      </VaultIsland>
    </section>
  );
}
