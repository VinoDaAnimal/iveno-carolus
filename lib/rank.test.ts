import { test } from "node:test";
import assert from "node:assert/strict";
import { ordinal, slotCentre, topPct } from "./rank.ts";

test("topPct matches the percentages printed on the old site", () => {
  assert.equal(topPct(64, 323), 19.8); // "Top 19.8% (323 active competitors)"
  assert.equal(topPct(42, 259), 16.2); // "Top 16.2% (259 active participants)"
});

test("topPct for the supplied medal results", () => {
  assert.equal(topPct(4, 159), 2.5);
  assert.equal(topPct(13, 288), 4.5);
  assert.equal(topPct(25, 251), 10);
  assert.equal(topPct(168, 604), 27.8);
});

test("topPct rejects impossible finishes", () => {
  assert.throws(() => topPct(0, 10), RangeError);
  assert.throws(() => topPct(11, 10), RangeError);
  assert.throws(() => topPct(1.5, 10), RangeError);
});

test("slotCentre puts first and last place inside the axis", () => {
  assert.equal(slotCentre(1, 2), 25);
  assert.equal(slotCentre(2, 2), 75);
  assert.ok(slotCentre(604, 604) < 100);
});

test("ordinal handles teens", () => {
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 42, 113].map(ordinal), ["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "42nd", "113th"]);
});
