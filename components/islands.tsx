"use client";

import { LazyIsland } from "@/components/lazy-island";

const loadVault = () => import("@/components/vault/vault-client").then((m) => m.VaultLive);
const loadExperience = () => import("@/components/experience-live").then((m) => m.ExperienceLive);

export function VaultIsland({ children }: { children: React.ReactNode }) {
  return <LazyIsland load={loadVault}>{children}</LazyIsland>;
}

export function ExperienceIsland({ children }: { children: React.ReactNode }) {
  return <LazyIsland load={loadExperience}>{children}</LazyIsland>;
}
