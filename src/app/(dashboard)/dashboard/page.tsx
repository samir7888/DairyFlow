import type { Metadata } from "next";
import { getDashboardDataAction } from "@/lib/actions/milk-sales";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { DashboardChartCard } from "@/components/dashboard/dashboard-chart-card";
import { RecentRecordsTable } from "@/components/dashboard/recent-records-table";
import { DateRangePicker } from "@/components/layout/date-range-picker";
import { DateRangePreset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Milk Sales Dashboard",
  description:
    "View daily litres sold, gross earnings in NPR, average milk price per litre, and fat quality statistics.",
};

interface DashboardPageProps {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedParams = await searchParams;
  const rangePreset = (resolvedParams.range || "last30days") as DateRangePreset;
  const from = resolvedParams.from || "";
  const to = resolvedParams.to || "";

  const data = await getDashboardDataAction({
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
            Milk Sales Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of daily litres sold, total revenue, and fat percentage
          </p>
        </div>
      </div>  

      {/* Date Range Filter Selector */}
      <DateRangePicker
        currentPreset={rangePreset}
        currentFrom={from}
        currentTo={to}
      />

      {/* Summary Stat Cards */}
      <SummaryCards
        totalLitres={data.summary.totalLitres}
        totalEarnings={data.summary.totalEarnings}
        avgPricePerLitre={data.summary.avgPricePerLitre}
        avgFat={data.summary.avgFat}
        recordCount={data.summary.recordCount}
      />

      {/* Interactive Line Chart */}
      <DashboardChartCard data={data.chartData} />

      {/* Recent Milk Sales Table */}
      <RecentRecordsTable records={data.recentRecords} />
    </div>
  );
}
