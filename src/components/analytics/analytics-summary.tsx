import { Milk, Banknote, Calendar, Percent, Award, Flame } from "lucide-react";
import { formatCurrency, formatDate, formatLitres, formatPercentage } from "@/lib/utils";

interface AnalyticsSummaryProps {
  summary: {
    totalLitres: number;
    totalEarnings: number;
    avgDailyMilk: number;
    avgFat: number;
    highestSale: { date: Date | string; litres: number } | null;
    highestEarningDay: { date: Date | string; amount: number } | null;
    sellingDaysCount: number;
  };
}

export function AnalyticsSummary({ summary }: AnalyticsSummaryProps) {
  const cards = [
    {
      title: "Total Volume Sold",
      value: formatLitres(summary.totalLitres),
      subtitle: `${summary.sellingDaysCount} active selling days`,
      icon: Milk,
      bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    {
      title: "Total Revenue Generated",
      value: formatCurrency(summary.totalEarnings),
      subtitle: "Gross income earned in NPR",
      icon: Banknote,
      bgColor: "bg-teal-50 text-teal-700 border-teal-200/80",
    },
    {
      title: "Average Daily Volume",
      value: formatLitres(summary.avgDailyMilk),
      subtitle: "Average per active selling day",
      icon: Calendar,
      bgColor: "bg-green-50 text-green-700 border-green-200/80",
    },
    {
      title: "Average Fat Content",
      value: formatPercentage(summary.avgFat),
      subtitle: "Quality measurement average",
      icon: Percent,
      bgColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    },
    {
      title: "Highest Single Volume Sale",
      value: summary.highestSale ? formatLitres(summary.highestSale.litres) : "N/A",
      subtitle: summary.highestSale ? `Achieved on ${formatDate(summary.highestSale.date)}` : "No sales logged",
      icon: Award,
      bgColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
    {
      title: "Highest Earning Day",
      value: summary.highestEarningDay ? formatCurrency(summary.highestEarningDay.amount) : "N/A",
      subtitle: summary.highestEarningDay ? `Peak revenue on ${formatDate(summary.highestEarningDay.date)}` : "No sales logged",
      icon: Flame,
      bgColor: "bg-orange-50 text-orange-700 border-orange-200/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {c.title}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${c.bgColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{c.value}</div>
              <p className="mt-1 text-xs text-slate-500 font-medium">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
