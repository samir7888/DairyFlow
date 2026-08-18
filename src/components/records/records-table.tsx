"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, Plus, FileSpreadsheet, ChevronLeft, ChevronRight, Search, Download, Upload } from "lucide-react";
import { formatCurrency, formatDate, formatLitres, formatPercentage } from "@/lib/utils";
import { DeleteSaleDialog } from "./delete-sale-dialog";
import { CSVImportDialog } from "./csv-import-dialog";

export interface MilkSaleRow {
  id: string;
  date: Date | string;
  litres: number;
  pricePerLitre: number;
  totalAmount: number;
  fat: number;
}

interface RecordsTableProps {
  items: MilkSaleRow[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export function RecordsTable({
  items,
  totalCount,
  totalPages,
  currentPage,
}: RecordsTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingRecord, setDeletingRecord] = useState<MilkSaleRow | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Client search filter (by formatted date or numbers)
  const filteredItems = items.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const dateStr = formatDate(r.date).toLowerCase();
    const litresStr = String(r.litres);
    const totalStr = String(r.totalAmount);
    return dateStr.includes(term) || litresStr.includes(term) || totalStr.includes(term);
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`/records?${params.toString()}`);
  };

  // Export CSV handler
  const handleExportCSV = () => {
    if (filteredItems.length === 0) {
      toast.error("No records available to export.");
      return;
    }

    const headers = ["Date", "Milk Quantity (L)", "Price per Litre (NPR)", "Total Amount (NPR)", "Milk Fat (%)"];
    
    const rows = filteredItems.map((r) => {
      const dateStr = new Date(r.date).toISOString().split("T")[0];
      return [
        `"${dateStr}"`,
        r.litres,
        r.pricePerLitre,
        r.totalAmount,
        r.fat,
      ].join(",");
    });

    const csvString = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const todayStr = new Date().toISOString().split("T")[0];
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `milk_sales_records_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredItems.length} records to CSV!`);
  };

  return (
    <div>
      {/* Search & Action Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records by date or volume..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
          />
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            title="Export filtered records to a CSV file"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Import CSV Button */}
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            title="Import records from a CSV file"
          >
            <Upload className="h-4 w-4 text-emerald-600" />
            <span>Import CSV</span>
          </button>

          {/* Record New Sale Button */}
          <Link
            href="/records/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Record New Sale</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white shadow-xs border border-slate-200/80 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Milk Quantity</th>
                <th className="px-6 py-3.5">Price / Litre</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Milk Fat</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {formatDate(r.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-emerald-800">
                      {formatLitres(r.litres)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {formatCurrency(r.pricePerLitre)}/L
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-900">
                      {formatCurrency(r.totalAmount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                        {formatPercentage(r.fat)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/records/${r.id}/edit`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                          title="Edit record"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingRecord(r)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <FileSpreadsheet className="mx-auto h-10 w-10 stroke-1 mb-2" />
                    <p className="text-sm font-medium">No sales records found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm
                        ? "Try matching a different date or search term"
                        : "Click 'Record New Sale' or 'Import CSV' to add entries."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <div>
              Showing page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span> ({totalCount} total entries)
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteSaleDialog
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        record={deletingRecord}
        onSuccess={() => router.refresh()}
      />

      {/* CSV Import Modal */}
      <CSVImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
