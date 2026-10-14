"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BS_MAX_YEAR,
  BS_MIN_YEAR,
  NEPALI_MONTH_NAMES,
  NEPALI_WEEKDAYS,
  adStringToBS,
  bsToADString,
  cn,
  formatNepaliDate,
  getBSMonthLength,
  getBSMonthStartWeekday,
  toDevanagariDigits,
  todayADStringNepal,
} from "@/lib/utils";

interface NepaliDatePickerProps {
  /** Selected date as an English (AD) "YYYY-MM-DD" string. This is what gets saved. */
  value: string;
  /** Called with the English (AD) "YYYY-MM-DD" string for the picked Nepali date. */
  onChange: (adDate: string) => void;
  id?: string;
  hasError?: boolean;
}

const YEARS = Array.from({ length: BS_MAX_YEAR - BS_MIN_YEAR + 1 }, (_, i) => BS_MIN_YEAR + i);

/**
 * Calendar that works entirely in Bikram Sambat (BS). The parent only ever sees
 * English (AD) strings, so storage and validation stay unchanged.
 */
export function NepaliDatePicker({ value, onChange, id, hasError }: NepaliDatePickerProps) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const rootRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const selected = adStringToBS(value);
  const todayBS = adStringToBS(todayADStringNepal());

  // Month currently shown in the calendar (separate from the selected date)
  const [view, setView] = useState(() => {
    const base = selected ?? todayBS;
    return { year: base?.year ?? BS_MIN_YEAR, month: base?.month ?? 0 };
  });

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!open) {
      // Always open on the month of the selected date
      const base = selected ?? todayBS;
      if (base) setView({ year: base.year, month: base.month });
    }
    setOpen((o) => !o);
  };

  const shiftMonth = (delta: number) => {
    setView((v) => {
      let month = v.month + delta;
      let year = v.year;
      if (month < 0) {
        month = 11;
        year -= 1;
      } else if (month > 11) {
        month = 0;
        year += 1;
      }
      if (year < BS_MIN_YEAR || year > BS_MAX_YEAR) return v;
      return { year, month };
    });
  };

  const pickDay = (day: number) => {
    const ad = bsToADString({ year: view.year, month: view.month, day });
    if (!ad) return;
    onChange(ad);
    setOpen(false);
  };

  const pickToday = () => {
    onChange(todayADStringNepal());
    setOpen(false);
  };

  const daysInMonth = getBSMonthLength(view.year, view.month);
  const startWeekday = getBSMonthStartWeekday(view.year, view.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (day: number) =>
    !!selected && selected.year === view.year && selected.month === view.month && selected.day === day;
  const isToday = (day: number) =>
    !!todayBS && todayBS.year === view.year && todayBS.month === view.month && todayBS.day === day;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={triggerId}
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "w-full flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-xl border bg-white text-left text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all",
          hasError ? "border-red-300" : "border-slate-200"
        )}
      >
        <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected ? formatNepaliDate(value) : "मिति छान्नुहोस् (Select date)"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Nepali date picker"
          className="absolute z-30 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
        >
          {/* Month / year header */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              <select
                value={view.month}
                onChange={(e) => setView((v) => ({ ...v, month: Number(e.target.value) }))}
                className="rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-sm font-semibold text-slate-900 focus:border-emerald-500 outline-hidden"
                aria-label="Month"
              >
                {NEPALI_MONTH_NAMES.map((name, i) => (
                  <option key={name} value={i}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={view.year}
                onChange={(e) => setView((v) => ({ ...v, year: Number(e.target.value) }))}
                className="rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-sm font-semibold text-slate-900 focus:border-emerald-500 outline-hidden"
                aria-label="Year"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {toDevanagariDigits(y)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-500 mb-1">
            {NEPALI_WEEKDAYS.map((d, i) => (
              <div key={d} className={cn("py-1", i === 6 && "text-red-500")}>
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) =>
              day === null ? (
                <div key={`blank-${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => pickDay(day)}
                  aria-label={`${toDevanagariDigits(day)} ${NEPALI_MONTH_NAMES[view.month]} ${toDevanagariDigits(view.year)}`}
                  aria-pressed={isSelected(day)}
                  className={cn(
                    "h-9 rounded-lg text-sm transition-colors",
                    isSelected(day)
                      ? "bg-emerald-600 font-bold text-white"
                      : isToday(day)
                        ? "border border-emerald-500 font-semibold text-emerald-700 hover:bg-emerald-50"
                        : "text-slate-700 hover:bg-slate-100",
                    !isSelected(day) && (startWeekday + day - 1) % 7 === 6 && "text-red-500"
                  )}
                >
                  {toDevanagariDigits(day)}
                </button>
              )
            )}
          </div>

          <div className="mt-2 flex justify-end border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={pickToday}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              आज (Today)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
