import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Decimal from "decimal.js";

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
