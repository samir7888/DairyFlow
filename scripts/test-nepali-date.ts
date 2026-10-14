/* Run with: npm run test:dates */
import assert from "node:assert/strict";
import {
  formatNepaliDate,
  formatNepaliDateISO,
  nepaliDateSearchText,
  toNepaliDate,
} from "../src/lib/utils";

let n = 0;
const test = (name: string, fn: () => void) => {
  fn();
  n++;
  console.log("ok -", name);
};

// Dates are stored as UTC midnight (new Date("YYYY-MM-DD")), exactly like the app does.
const stored = (ymd: string) => new Date(ymd);

test("known anchors: Baisakh 1 (Nepali new year)", () => {
  assert.equal(formatNepaliDateISO(stored("2025-04-14")), "2082-01-01");
  assert.equal(formatNepaliDateISO(stored("2026-04-14")), "2083-01-01");
});

test("known anchor: 2000-01-01 AD = 2056-09-17 BS", () => {
  assert.equal(formatNepaliDateISO(stored("2000-01-01")), "2056-09-17");
});

test("Devanagari display", () => {
  assert.equal(formatNepaliDate(stored("2026-08-18")), "२ भाद्र २०८३");
  assert.equal(formatNepaliDate(stored("2026-10-14")), "२८ आश्विन २०८३");
});

test("accepts ISO strings (as serialised from server components)", () => {
  assert.equal(formatNepaliDateISO("2026-08-18T00:00:00.000Z"), "2083-05-02");
});

test("independent of process timezone", () => {
  for (const tz of ["UTC", "Asia/Kathmandu", "America/Los_Angeles", "Pacific/Kiritimati"]) {
    process.env.TZ = tz;
    assert.equal(formatNepaliDateISO(stored("2026-08-18")), "2083-05-02", `TZ=${tz}`);
  }
});

test("month and year boundaries", () => {
  // Last day of Chaitra 2082 -> day before Baisakh 1 2083
  assert.equal(formatNepaliDateISO(stored("2026-04-13")), "2082-12-30");
  assert.equal(formatNepaliDateISO(stored("2026-04-14")), "2083-01-01");
});

test("invalid / empty input is safe", () => {
  assert.equal(formatNepaliDate(null), "—");
  assert.equal(formatNepaliDate(undefined), "—");
  assert.equal(formatNepaliDate("not-a-date"), "—");
  assert.equal(toNepaliDate("garbage"), null);
  assert.equal(formatNepaliDateISO(null), "");
});

test("out-of-range date does not throw", () => {
  assert.equal(formatNepaliDate(stored("1800-01-01")), "—");
  assert.equal(formatNepaliDate(stored("2300-01-01")), "—");
});

test("search text matches Devanagari, romanised and ISO forms", () => {
  const t = nepaliDateSearchText(stored("2026-08-18"));
  assert.ok(t.includes("भाद्र"));
  assert.ok(t.includes("bhadra"));
  assert.ok(t.includes("2083-05-02"));
});

console.log(`\n${n} tests passed`);
