import { Milk, Banknote, Tag, Percent } from "lucide-react";
import { formatCurrency, formatLitres, formatPercentage } from "@/lib/utils";

interface SummaryCardsProps {
  totalLitres: number;
  totalEarnings: number;
  avgPricePerLitre: number;
  avgFat: number;
  recordCount: number;
}

export function SummaryCards({
  totalLitres,
  totalEarnings,
  avgPricePerLitre,
  avgFat,
  recordCount,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Milk Sold",
      value: formatLitres(totalLitres),
      subtitle: `${recordCount} recorded entries`,
      icon: Milk,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(totalEarnings),
      subtitle: "Gross income in NPR",
      icon: Banknote,
      iconBg: "bg-teal-50 text-teal-600 border-teal-200/80",
    },
    {
      title: "Average Milk Price",
      value: `${formatCurrency(avgPricePerLitre)}/L`,
      subtitle: "Average revenue per litre",
      icon: Tag,
      iconBg: "bg-green-50 text-green-600 border-green-200/80",
    },
    {
      title: "Average Milk Fat",
      value: formatPercentage(avgFat),
      subtitle: "Fat content quality average",
      icon: Percent,
      iconBg: "bg-emerald-50/80 text-emerald-700 border-emerald-200/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 hover:border-emerald-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
