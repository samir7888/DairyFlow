import Link from "next/link";
import { ArrowRight, Plus, FileText, Milk } from "lucide-react";
import { formatCurrency, formatDate, formatLitres, formatPercentage } from "@/lib/utils";

interface MilkSaleRecord {
  id: string;
  date: Date | string;
  litres: number;
  pricePerLitre: number;
  totalAmount: number;
  fat: number;
}

interface RecentRecordsTableProps {
  records: MilkSaleRecord[];
}

export function RecentRecordsTable({ records }: RecentRecordsTableProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xs border border-slate-200/80 mb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4">
          <Milk className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No milk sales recorded yet</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
          Start tracking your daily milk sales by adding your first invoice record.
        </p>
        <div className="mt-5">
          <Link
            href="/records/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Milk Sale</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-xs border border-slate-200/80 mb-6 overflow-hidden">
      {/* Table Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-600" />
          <h2 className="font-bold text-slate-900 text-base">Recent Milk Sales</h2>
        </div>
        <Link
          href="/records"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <span>View All Records</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Responsive horizontal scroll container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200/60">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Milk Sold</th>
              <th className="px-6 py-3">Price / L</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Fat %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="whitespace-nowrap px-6 py-3.5 font-medium text-slate-900">
                  {formatDate(r.date)}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 font-semibold text-emerald-800">
                  {formatLitres(r.litres)}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-slate-600">
                  {formatCurrency(r.pricePerLitre)}/L
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 font-bold text-slate-900">
                  {formatCurrency(r.totalAmount)}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/60">
                    {formatPercentage(r.fat)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
