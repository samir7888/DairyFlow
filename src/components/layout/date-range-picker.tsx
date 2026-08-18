"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Calendar, Filter, RotateCcw } from "lucide-react";
import { DateRangePreset } from "@/lib/utils";

interface DateRangePickerProps {
  currentPreset?: DateRangePreset;
  currentFrom?: string;
  currentTo?: string;
}

const presets: { label: string; value: DateRangePreset }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
  { label: "Custom Range", value: "custom" },
  { label: "All Time", value: "all" },
];

export function DateRangePicker({
  currentPreset = "last30days",
  currentFrom = "",
  currentTo = "",
}: DateRangePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [preset, setPreset] = useState<DateRangePreset>(currentPreset);
  const [from, setFrom] = useState(currentFrom);
  const [to, setTo] = useState(currentTo);

  const applyFilter = (newPreset: DateRangePreset, customFrom = from, customTo = to) => {
    setPreset(newPreset);
    const params = new URLSearchParams(searchParams.toString());

    if (newPreset === "all") {
      params.delete("range");
      params.delete("from");
      params.delete("to");
    } else {
      params.set("range", newPreset);
      if (newPreset === "custom") {
        if (customFrom) params.set("from", customFrom);
        else params.delete("from");
        if (customTo) params.set("to", customTo);
        else params.delete("to");
      } else {
        params.delete("from");
        params.delete("to");
      }
    }

    params.set("page", "1"); // Reset pagination on filter change

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setPreset("last30days");
    setFrom("");
    setTo("");
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", "last30days");
    params.delete("from");
    params.delete("to");
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-xs border border-slate-200/80 mb-6">
      <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold px-2">
        <Filter className="h-4 w-4 text-emerald-600" />
        <span>Date Range:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 flex-1">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => applyFilter(p.value)}
            disabled={isPending}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              preset === p.value
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex flex-wrap items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500">From:</span>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                applyFilter("custom", e.target.value, to);
              }}
              className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500">To:</span>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                applyFilter("custom", from, e.target.value);
              }}
              className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {(searchParams.has("range") || searchParams.has("from")) && (
        <button
          onClick={handleReset}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          title="Reset to default range"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
