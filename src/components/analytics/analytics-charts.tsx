"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Milk, Banknote, Percent, Activity } from "lucide-react";
import { formatCurrency, formatLitres, formatPercentage } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SeriesPoint {
  date: string;
  displayDate: string;
  litres: number;
  earnings: number;
  fat: number;
}

interface AnalyticsChartsProps {
  series: SeriesPoint[];
}

export function AnalyticsCharts({ series }: AnalyticsChartsProps) {
  const labels = series.map((s) => s.displayDate);

  if (series.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center border border-slate-200 text-slate-400 mb-8">
        <Activity className="mx-auto h-10 w-10 mb-2 stroke-1" />
        <p className="text-sm font-medium">No trend data available for the selected period</p>
      </div>
    );
  }

  // 1. Milk Quantity Chart
  const milkChartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Milk Sold (L)",
        data: series.map((s) => s.litres),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.12)",
        pointBackgroundColor: "#047857",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  // 2. Daily Earnings Chart
  const earningsChartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Total Earnings (NPR)",
        data: series.map((s) => s.earnings),
        borderColor: "#0d9488",
        backgroundColor: "rgba(13, 148, 136, 0.12)",
        pointBackgroundColor: "#0f766e",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  // 3. Milk Fat % Chart
  const fatChartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Milk Fat (%)",
        data: series.map((s) => s.fat),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.12)",
        pointBackgroundColor: "#15803d",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  const createOptions = (unitFormatter: (val: number) => string, yAxisLabel: string): ChartOptions<"line"> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#34d399",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${unitFormatter(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 10 } },
      },
      y: {
        grid: { color: "rgba(226, 232, 240, 0.6)" },
        ticks: {
          color: "#64748b",
          font: { size: 10 },
          callback: (value) => `${value} ${yAxisLabel}`,
        },
      },
    },
  });

  return (
    <div className="space-y-8 mb-8">
      {/* Chart 1: Milk Quantity */}
      <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Milk className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Milk Quantity Over Time</h3>
            <p className="text-xs text-slate-500">Daily litres delivered to dairy buyer</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <Line data={milkChartData} options={createOptions((v) => formatLitres(v), "L")} />
        </div>
      </div>

      {/* Chart 2: Daily Earnings */}
      <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
            <Banknote className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daily Earnings Over Time (NPR)</h3>
            <p className="text-xs text-slate-500">Gross revenue calculated from price per litre</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <Line data={earningsChartData} options={createOptions((v) => formatCurrency(v), "NPR")} />
        </div>
      </div>

      {/* Chart 3: Milk Fat Percentage */}
      <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 border border-green-100">
            <Percent className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Milk Fat Percentage Over Time</h3>
            <p className="text-xs text-slate-500">Track fat trend variations across dates (e.g. 3.9%, 4.1%, 4.3%)</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <Line data={fatChartData} options={createOptions((v) => formatPercentage(v), "%")} />
        </div>
      </div>
    </div>
  );
}
