import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Decimal from "decimal.js";
import NepaliDate, { dateConfigMap } from "nepali-date-converter";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely multiplies litres and price per litre using Decimal.js
 */
export function calculateTotalAmount(litres: number, pricePerLitre: number): number {
  if (isNaN(litres) || isNaN(pricePerLitre) || litres <= 0 || pricePerLitre < 0) {
    return 0;
  }
  const decLitres = new Decimal(litres);
  const decPrice = new Decimal(pricePerLitre);
  return decLitres.mul(decPrice).toDecimalPlaces(2).toNumber();
}

/**
 * Formats monetary amounts consistently as `NPR 1,202.50`
 */
export function formatCurrency(amount: number | string | Decimal | null | undefined): string {
  if (amount === null || amount === undefined) return "NPR 0.00";
  const num = typeof amount === "number" ? amount : new Decimal(amount.toString()).toNumber();
  
  return `NPR ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats litres value (e.g. 1,245.50 L)
 */
export function formatLitres(litres: number | string | Decimal | null | undefined): string {
  if (litres === null || litres === undefined) return "0.00 L";
  const num = typeof litres === "number" ? litres : new Decimal(litres.toString()).toNumber();
  
  return `${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} L`;
}

/**
 * Formats percentage value (e.g. 4.12%)
 */
export function formatPercentage(fat: number | string | Decimal | null | undefined): string {
  if (fat === null || fat === undefined) return "0.00%";
  const num = typeof fat === "number" ? fat : new Decimal(fat.toString()).toNumber();
  
  return `${num.toFixed(2)}%`;
}

/**
 * Converts date object or string into readable format (e.g., Aug 18, 2026)
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Converts a stored sale date (AD) to a Bikram Sambat (BS) date.
 *
 * Sale dates are saved as `new Date("YYYY-MM-DD")`, i.e. UTC midnight, so the
 * calendar day is read from the UTC parts. This keeps the BS date identical to
 * the date the user picked regardless of the server / browser timezone.
 * Returns null for invalid or out-of-range dates.
 */
export function toNepaliDate(date: Date | string | null | undefined): NepaliDate | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  try {
    return NepaliDate.fromAD(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  } catch {
    return null; // outside the supported BS calendar range
  }
}

/**
 * Nepali date in Devanagari for display (e.g., २ भाद्र २०८३)
 */
export function formatNepaliDate(date: Date | string | null | undefined): string {
  const n = toNepaliDate(date);
  if (!n) return "—";
  return n.format("D MMMM YYYY", "np");
}

/**
 * Nepali date as plain ISO-style digits (e.g., 2083-05-02), used for CSV export
 */
export function formatNepaliDateISO(date: Date | string | null | undefined): string {
  const n = toNepaliDate(date);
  if (!n) return "";
  return n.format("YYYY-MM-DD");
}

/**
 * All searchable text forms of the Nepali date (Devanagari, romanised month, ISO)
 */
export function nepaliDateSearchText(date: Date | string | null | undefined): string {
  const n = toNepaliDate(date);
  if (!n) return "";
  return [
    n.format("D MMMM YYYY", "np"),
    n.format("D MMMM YYYY"),
    n.format("YYYY-MM-DD"),
  ]
    .join(" ")
    .toLowerCase();
}

/* -------------------------------------------------------------------------- */
/*  Nepali (BS) <-> English (AD) conversion for the date picker                 */
/*                                                                              */
/*  The database always stores AD. The picker works in BS and converts to an    */
/*  AD "YYYY-MM-DD" string, which is what the server action already expects.    */
/*  Only plain year/month/day numbers are used here (no timezone-dependent      */
/*  Date maths) so a picked day can never shift by one.                         */
/* -------------------------------------------------------------------------- */

export interface BSDateParts {
  year: number;
  /** 0-11, Baisakh = 0 */
  month: number;
  day: number;
}

const BS_YEARS = Object.keys(dateConfigMap).map(Number);
export const BS_MIN_YEAR = Math.min(...BS_YEARS);
export const BS_MAX_YEAR = Math.max(...BS_YEARS);

const BS_MONTH_KEYS = [
  "Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Aswin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
] as const;

/** Month names in Nepali script, Baisakh first */
export const NEPALI_MONTH_NAMES = [
  "बैशाख", "जेठ", "असार", "श्रावण", "भाद्र", "आश्विन",
  "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुण", "चैत्र",
];

/** Weekday names in Nepali script, Sunday first */
export const NEPALI_WEEKDAYS = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toDevanagariDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

/** Number of days in a BS month, or 0 if the year/month is outside the supported range */
export function getBSMonthLength(year: number, month: number): number {
  const row = dateConfigMap[String(year)];
  if (!row || month < 0 || month > 11) return 0;
  return row[BS_MONTH_KEYS[month]] ?? 0;
}

/** Weekday (0 = Sunday) of the 1st of a BS month */
export function getBSMonthStartWeekday(year: number, month: number): number {
  return new NepaliDate(year, month, 1).getDay();
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * BS -> AD. Returns an AD "YYYY-MM-DD" string, or null if the BS date doesn't exist.
 */
export function bsToADString({ year, month, day }: BSDateParts): string | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (day < 1 || day > getBSMonthLength(year, month)) return null;
  try {
    const ad = new NepaliDate(year, month, day).getAD();
    return `${ad.year}-${pad2(ad.month + 1)}-${pad2(ad.date)}`;
  } catch {
    return null;
  }
}

/**
 * AD "YYYY-MM-DD" (or an ISO timestamp, read as its calendar day) -> BS parts.
 * Returns null for invalid or out-of-range input.
 */
export function adStringToBS(value: string | null | undefined): BSDateParts | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  try {
    const bs = NepaliDate.fromAD(new Date(y, mo - 1, d)).getBS();
    return { year: bs.year, month: bs.month, day: bs.date };
  } catch {
    return null;
  }
}

/**
 * Today's calendar date in Nepal (Asia/Kathmandu) as AD "YYYY-MM-DD".
 * Using UTC here would return yesterday's date before 5:45 AM Nepal time,
 * which is exactly when many dairy collections are recorded.
 */
export function todayADStringNepal(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Date Range Helper for filtering records
 */
export type DateRangePreset =
  | "today"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "custom"
  | "all";

export function getDateRangeBounds(preset: DateRangePreset, customFrom?: string, customTo?: string): {
  startDate?: Date;
  endDate?: Date;
} {
  const now = new Date();
  
  switch (preset) {
    case "today": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
    case "last7days": {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
    case "last30days": {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
    case "thisMonth": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
    case "lastMonth": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
    case "thisYear": {
      const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
    case "custom": {
      let start: Date | undefined = undefined;
      let end: Date | undefined = undefined;
      if (customFrom) {
        start = new Date(customFrom);
        start.setHours(0, 0, 0, 0);
      }
      if (customTo) {
        end = new Date(customTo);
        end.setHours(23, 59, 59, 999);
      }
      return { startDate: start, endDate: end };
    }
    case "all":
    default:
      return {};
  }
}
