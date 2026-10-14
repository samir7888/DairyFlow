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
  const secondary = [
    { label: "Milk sold", value: formatLitres(totalLitres), note: `${recordCount} ${recordCount === 1 ? "entry" : "entries"}` },
    { label: "Average price", value: `${formatCurrency(avgPricePerLitre)}/L`, note: "per litre" },
    { label: "Average fat", value: formatPercentage(avgFat), note: "milk fat" },
  ];

  return (
    <section
      aria-label="Summary for the selected period"
      className="mb-6 grid divide-y divide-brand-100 overflow-hidden rounded-lg border border-brand-200 bg-white lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:divide-x lg:divide-y-0"
    >
      <div className="p-5 lg:p-6">
        <div className="text-sm font-medium text-brand-500">Total earnings</div>
        <div className="mt-2">
          <span className="whitespace-nowrap rounded-sm bg-marigold-300/60 px-2 py-0.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {formatCurrency(totalEarnings)}
          </span>
        </div>
      </div>
      {secondary.map((s) => (
        <div key={s.label} className="flex items-baseline justify-between gap-4 px-5 py-3.5 lg:block lg:p-6">
          <div className="text-sm font-medium text-brand-500">{s.label}</div>
          <div className="font-display text-xl font-bold tracking-tight text-ink lg:mt-2 lg:text-2xl">{s.value}</div>
          <div className="hidden text-sm text-brand-500 lg:mt-1 lg:block">{s.note}</div>
        </div>
      ))}
    </section>
  );
}
