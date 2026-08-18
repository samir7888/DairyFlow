"use client";

import { useState } from "react";
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
import { Milk, Banknote, Percent, LineChart } from "lucide-react";
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

interface ChartDataPoint {
  date: string;
  displayDate: string;
  litres: number;
  earnings: number;
  avgFat: number;
}

interface DashboardChartCardProps {
  data: ChartDataPoint[];
}

type MetricType = "litres" | "earnings" | "avgFat";

export function DashboardChartCard({ data }: DashboardChartCardProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>("litres");

  const labels = data.map((d) => d.displayDate);

  const getMetricConfig = () => {
    switch (activeMetric) {
      case "litres":
        return {
          label: "Milk Sold (Litres)",
          values: data.map((d) => d.litres),
          borderColor: "#059669",
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          pointBackgroundColor: "#047857",
          unitFormatter: (val: number) => formatLitres(val),
        };
      case "earnings":
        return {
          label: "Daily Earnings (NPR)",
          values: data.map((d) => d.earnings),
          borderColor: "#0d9488",
          backgroundColor: "rgba(20, 184, 166, 0.12)",
          pointBackgroundColor: "#0f766e",
          unitFormatter: (val: number) => formatCurrency(val),
        };
      case "avgFat":
        return {
          label: "Average Milk Fat (%)",
          values: data.map((d) => d.avgFat),
          borderColor: "#16a34a",
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          pointBackgroundColor: "#15803d",
          unitFormatter: (val: number) => formatPercentage(val),
        };
    }
  };

  const config = getMetricConfig();

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: config.label,
        data: config.values,
        borderColor: config.borderColor,
        backgroundColor: config.backgroundColor,
        pointBackgroundColor: config.pointBackgroundColor,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        borderWidth: 2.5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#34d399",
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const val = context.parsed.y ?? 0;
            return ` ${config.label}: ${config.unitFormatter(val)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(226, 232, 240, 0.6)",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
          callback: (value) => {
            if (activeMetric === "earnings") return `NPR ${value}`;
            if (activeMetric === "avgFat") return `${value}%`;
            return `${value} L`;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 mb-6">
      {/* Header with Title & Metric Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <LineChart className="h-5 w-5 text-emerald-600" />
            <span>Milk Sales Over Time</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated daily statistics recorded from your milk seller invoices
          </p>
        </div>

        {/* Toggle metric pill buttons */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric("litres")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeMetric === "litres"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Milk className=" hidden md:flex h-3.5 w-3.5 text-emerald-600" />
            <span>Milk (Litres)</span>
          </button>

          <button
            onClick={() => setActiveMetric("earnings")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeMetric === "earnings"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Banknote className="hidden md:flex h-3.5 w-3.5 text-teal-600" />
            <span>Earnings (NPR)</span>
          </button>

          <button
            onClick={() => setActiveMetric("avgFat")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeMetric === "avgFat"
                ? "bg-white text-green-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Percent className="hidden md:flex h-3.5 w-3.5 text-green-600" />
            <span>Avg Fat (%)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas area */}
      <div className="h-72 w-full">
        {data.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <LineChart className="h-10 w-10 mb-2 stroke-1" />
            <p className="text-sm font-medium">No sales recorded for the selected date range</p>
          </div>
        )}
      </div>
    </div>
  );
}
