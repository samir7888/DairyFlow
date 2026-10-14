/* Run with: npm run test:dates */
import assert from "node:assert/strict";
import {
  BS_MAX_YEAR,
  BS_MIN_YEAR,
  bsToADString,
  adStringToBS,
  getBSMonthLength,
  getBSMonthStartWeekday,
  todayADStringNepal,
  toDevanagariDigits,
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
  const original = process.env.TZ;
  try {
    for (const tz of ["UTC", "Asia/Kathmandu", "America/Los_Angeles", "Pacific/Kiritimati"]) {
      process.env.TZ = tz;
      assert.equal(formatNepaliDateISO(stored("2026-08-18")), "2083-05-02", `TZ=${tz}`);
    }
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
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

// ---------- Picker logic: Nepali pick -> English value stored in DB ----------

test("BS pick converts to the AD string saved in the DB", () => {
  assert.equal(bsToADString({ year: 2083, month: 4, day: 2 }), "2026-08-18"); // 2 Bhadra 2083
  assert.equal(bsToADString({ year: 2083, month: 0, day: 1 }), "2026-04-14"); // 1 Baisakh 2083
  assert.equal(bsToADString({ year: 2056, month: 8, day: 17 }), "2000-01-01");
});

test("AD string converts back to BS parts for the edit form", () => {
  assert.deepEqual(adStringToBS("2026-08-18"), { year: 2083, month: 4, day: 2 });
  assert.deepEqual(adStringToBS("2026-08-18T00:00:00.000Z"), { year: 2083, month: 4, day: 2 });
});

test("invalid BS dates are rejected, not silently rolled over", () => {
  assert.equal(bsToADString({ year: 2083, month: 0, day: 32 }), null); // Baisakh 2083 has 31 days
  assert.equal(bsToADString({ year: 2083, month: 0, day: 0 }), null);
  assert.equal(bsToADString({ year: 2083, month: 12, day: 1 }), null);
  assert.equal(bsToADString({ year: 1999, month: 0, day: 1 }), null);
  assert.equal(bsToADString({ year: BS_MAX_YEAR + 1, month: 0, day: 1 }), null);
  assert.equal(adStringToBS(""), null);
  assert.equal(adStringToBS("nope"), null);
});

function exhaustiveRoundTrip() {
  let prevAD: string | null = null;
  let days = 0;
  for (let year = BS_MIN_YEAR; year <= BS_MAX_YEAR; year++) {
    for (let month = 0; month < 12; month++) {
      const len = getBSMonthLength(year, month);
      assert.ok(len >= 29 && len <= 32, `bad month length ${year}-${month}: ${len}`);
      for (let day = 1; day <= len; day++) {
        const ad = bsToADString({ year, month, day });
        assert.ok(ad, `no AD for ${year}-${month + 1}-${day}`);
        assert.deepEqual(adStringToBS(ad), { year, month, day }, `round trip ${year}-${month + 1}-${day} (${ad})`);
        if (prevAD) {
          const expected = new Date(Date.UTC(+prevAD.slice(0, 4), +prevAD.slice(5, 7) - 1, +prevAD.slice(8, 10) + 1))
            .toISOString()
            .slice(0, 10);
          assert.equal(ad, expected, `gap/duplicate at ${year}-${month + 1}-${day}`);
        }
        prevAD = ad;
        days++;
      }
    }
  }
  console.log(`   (${days} days checked, BS ${BS_MIN_YEAR}-${BS_MAX_YEAR})`);
}

test("every supported BS day round-trips BS->AD->BS (AD advances by exactly one day) in realistic timezones", () => {
  const original = process.env.TZ;
  try {
    // Nepal, UTC (server), India, US (DST) and Australia (DST, ahead of UTC)
    for (const tz of ["Asia/Kathmandu", "UTC", "Asia/Kolkata", "America/New_York", "Australia/Sydney"]) {
      process.env.TZ = tz;
      process.stdout.write(`   TZ=${tz}: `);
      exhaustiveRoundTrip();
    }
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});

test("month start weekday matches the real AD weekday", () => {
  for (const [y, m] of [[2083, 0], [2083, 4], [2082, 11], [2060, 6]] as const) {
    const ad = bsToADString({ year: y, month: m, day: 1 })!;
    const realWeekday = new Date(Date.UTC(+ad.slice(0, 4), +ad.slice(5, 7) - 1, +ad.slice(8, 10))).getUTCDay();
    assert.equal(getBSMonthStartWeekday(y, m), realWeekday, `${y}-${m + 1}`);
  }
});

test("Devanagari digits", () => {
  assert.equal(toDevanagariDigits(2083), "२०८३");
  assert.equal(toDevanagariDigits("07"), "०७");
});

test("today in Nepal time uses Asia/Kathmandu, not UTC", () => {
  // 20:00 UTC on 17 Aug = 01:45 on 18 Aug in Nepal
  assert.equal(todayADStringNepal(new Date("2026-08-17T20:00:00Z")), "2026-08-18");
  // 18:00 UTC on 17 Aug = 23:45 on 17 Aug in Nepal
  assert.equal(todayADStringNepal(new Date("2026-08-17T18:00:00Z")), "2026-08-17");
  assert.match(todayADStringNepal(), /^\d{4}-\d{2}-\d{2}$/);
});

console.log(`\n${n} tests passed`);
