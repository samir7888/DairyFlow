import type { Metadata } from "next";
import { getAnalyticsDataAction } from "@/lib/actions/milk-sales";
import { AnalyticsSummary } from "@/components/analytics/analytics-summary";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { DateRangePicker } from "@/components/layout/date-range-picker";
import { DateRangePreset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Production & Sales Analytics",
  description:
    "Analyze historical milk sales trends, daily average volumes, peak revenue days in NPR, and milk fat quality performance.",
};

interface AnalyticsPageProps {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const resolvedParams = await searchParams;
  const rangePreset = (resolvedParams.range || "all") as DateRangePreset;
  const from = resolvedParams.from || "";
  const to = resolvedParams.to || "";

  const data = await getAnalyticsDataAction({
    range: rangePreset,
    from,
    to,
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Production & Sales Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deep insights into milk volume, revenue trends, and fat quality performance
          </p>
        </div>
      </div>

      {/* Date Range Filter Selector */}
      <DateRangePicker
        currentPreset={rangePreset}
        currentFrom={from}
        currentTo={to}
      />

      {/* Extended Analytics Cards */}
      <AnalyticsSummary summary={data.summary} />

      {/* 3 Dedicated Chart.js visualizations (Litres, Earnings, Fat %) */}
      <AnalyticsCharts series={data.chartSeries} />
    </div>
  );
}
