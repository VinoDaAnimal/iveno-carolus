"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** The build year in the static HTML, then the viewer's current year once hydrated. */
export function Year({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => buildYear);
  return <time dateTime={String(year)}>{year}</time>;
}
