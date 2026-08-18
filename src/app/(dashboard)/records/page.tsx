import type { Metadata } from "next";
import { getMilkSalesAction } from "@/lib/actions/milk-sales";
import { RecordsTable } from "@/components/records/records-table";
import { DateRangePicker } from "@/components/layout/date-range-picker";
import { DateRangePreset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Milk Selling Records & Ledger",
  description:
    "Search, filter, edit, delete, export, and manage your complete historical milk sales records and invoice receipts.",
};

interface RecordsPageProps {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

export default async function RecordsPage({ searchParams }: RecordsPageProps) {
  const resolvedParams = await searchParams;
  const rangePreset = (resolvedParams.range || "all") as DateRangePreset;
  const from = resolvedParams.from || "";
  const to = resolvedParams.to || "";
  const page = parseInt(resolvedParams.page || "1", 10);

  const data = await getMilkSalesAction({
    range: rangePreset,
    from,
    to,
    page,
    limit: 10,
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Milk Selling Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete digital ledger of daily milk invoices and receipts
          </p>
        </div>
      </div>

      {/* Date Range Filter Selector */}
      <DateRangePicker
        currentPreset={rangePreset}
        currentFrom={from}
        currentTo={to}
      />

      {/* Records Listing Table */}
      <RecordsTable
        items={data.items}
        totalCount={data.totalCount}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
      />
    </div>
  );
}
