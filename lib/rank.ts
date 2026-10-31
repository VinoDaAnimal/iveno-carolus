/** Share of the field at or above this rank, as a percentage to one decimal. */
export function topPct(rank: number, field: number): number {
  if (!Number.isInteger(rank) || !Number.isInteger(field) || rank < 1 || field < 1 || rank > field) {
    throw new RangeError(`rank ${rank} of ${field} is not a valid finish`);
  }
  return Math.round((rank / field) * 1000) / 10;
}

/** Centre of this rank's slot on a 0–100 axis where 0 is first place. */
export function slotCentre(rank: number, field: number): number {
  return ((rank - 0.5) / field) * 100;
}

export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
}
