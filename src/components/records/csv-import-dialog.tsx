"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, X, ArrowRight } from "lucide-react";
import { importMilkSalesCSVAction } from "@/lib/actions/milk-sales";
import { MilkSaleFormValues } from "@/lib/validations/milk-sale";
import { formatCurrency, formatLitres, formatPercentage } from "@/lib/utils";

interface CSVImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ParsedCSVRow {
  rowNum: number;
  date: string;
  litres: number;
  pricePerLitre: number;
  totalAmount: number;
  fat: number;
  isValid: boolean;
  error?: string;
}

export function CSVImportDialog({ isOpen, onClose, onSuccess }: CSVImportDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedCSVRow[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadSample = () => {
    const csvContent =
      "Date,Litres,PricePerLitre,TotalAmount,Fat\n" +
      "2026-08-18,18.50,65.00,1202.50,4.2\n" +
      "2026-08-17,17.80,65.00,1157.00,4.1\n" +
      "2026-08-16,19.20,66.00,1267.20,4.3\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "milk_sales_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setParsingError("Please select a valid .csv file.");
      return;
    }

    setFile(selectedFile);
    setParsingError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        parseCSVText(text);
      } catch {
        setParsingError("Error reading CSV file content.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const parseCSVText = (text: string) => {
    const lines = text
      .split(/\r\n|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      setParsingError("CSV file must contain a header row and at least 1 data row.");
      setParsedRows([]);
      return;
    }

    // Header matching
    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ""));

    const dateIdx = headers.findIndex((h) => h.includes("date"));
    const litresIdx = headers.findIndex((h) => h.includes("litre") || h.includes("milk") || h.includes("qty") || h.includes("volume"));
    const priceIdx = headers.findIndex((h) => h.includes("price") || h.includes("rate"));
    const totalIdx = headers.findIndex((h) => h.includes("total") || h.includes("amount"));
    const fatIdx = headers.findIndex((h) => h.includes("fat"));

    if (dateIdx === -1 || litresIdx === -1 || priceIdx === -1 || fatIdx === -1) {
      setParsingError("CSV must contain columns for Date, Litres, Price, and Fat.");
      setParsedRows([]);
      return;
    }

    const rows: ParsedCSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (cols.length < 4) continue;

      const dateRaw = cols[dateIdx] || "";
      const litresRaw = parseFloat(cols[litresIdx]);
      const priceRaw = parseFloat(cols[priceIdx]);
      const totalRaw = totalIdx !== -1 ? parseFloat(cols[totalIdx]) : NaN;
      const fatRaw = parseFloat(cols[fatIdx]);

      let isValid = true;
      let error = "";

      if (!dateRaw || isNaN(Date.parse(dateRaw))) {
        isValid = false;
        error = "Invalid date format (use YYYY-MM-DD)";
      } else if (isNaN(litresRaw) || litresRaw <= 0) {
        isValid = false;
        error = "Litres must be > 0";
      } else if (isNaN(priceRaw) || priceRaw < 0) {
        isValid = false;
        error = "Price must be >= 0";
      } else if (isNaN(fatRaw) || fatRaw <= 0 || fatRaw > 25) {
        isValid = false;
        error = "Fat must be > 0%";
      }

      // Standardize YYYY-MM-DD
      let formattedDate = dateRaw;
      try {
        formattedDate = new Date(dateRaw).toISOString().split("T")[0];
      } catch {
        isValid = false;
      }

      const calculatedTotal = !isNaN(litresRaw) && !isNaN(priceRaw) ? litresRaw * priceRaw : 0;
      const finalTotal = !isNaN(totalRaw) && totalRaw >= 0 ? totalRaw : calculatedTotal;

      rows.push({
        rowNum: i + 1,
        date: formattedDate,
        litres: litresRaw || 0,
        pricePerLitre: priceRaw || 0,
        totalAmount: parseFloat(finalTotal.toFixed(2)),
        fat: fatRaw || 0,
        isValid,
        error,
      });
    }

    setParsedRows(rows);
    if (rows.length === 0) {
      setParsingError("No readable data rows found in CSV file.");
    }
  };

  const validRows = parsedRows.filter((r) => r.isValid);

  const handleImport = () => {
    if (validRows.length === 0) {
      toast.error("No valid records to import.");
      return;
    }

    const payload: MilkSaleFormValues[] = validRows.map((r) => ({
      date: r.date,
      litres: r.litres,
      pricePerLitre: r.pricePerLitre,
      totalAmount: r.totalAmount,
      fat: r.fat,
    }));

    startTransition(async () => {
      const res = await importMilkSalesCSVAction(payload);
      if (res.success && res.data) {
        toast.success(`Successfully imported ${res.data.count} milk sale records!`);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error || "Failed to import CSV records.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Import Milk Sales CSV</h3>
              <p className="text-xs text-slate-500">Upload a CSV file containing date, litres, price, and fat %</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Top action row: Download template button */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-xs">
            <span className="text-slate-600 font-medium">Need the standard CSV format template?</span>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <Download className="h-3.5 w-3.5" /> Download Sample CSV
            </button>
          </div>

          {/* File input / Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select CSV File
            </label>
            <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto h-8 w-8 text-emerald-600 mb-2 stroke-1" />
              <p className="text-xs font-semibold text-slate-700">
                {file ? file.name : "Click or drag & drop CSV file here"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports standard CSV formatting</p>
            </div>
          </div>

          {parsingError && (
            <div className="rounded-xl bg-red-50 p-3 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{parsingError}</span>
            </div>
          )}

          {/* Parsed CSV Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>CSV Preview ({validRows.length} valid / {parsedRows.length} total)</span>
                <span className="text-emerald-700 font-medium">{validRows.length} ready to import</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto text-xs">
                <table className="w-full text-left text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Row</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Litres</th>
                      <th className="px-3 py-2">Price/L</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">Fat %</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r) => (
                      <tr key={r.rowNum} className={r.isValid ? "hover:bg-slate-50" : "bg-red-50/50"}>
                        <td className="px-3 py-2 text-slate-400 font-mono text-[10px]">#{r.rowNum}</td>
                        <td className="px-3 py-2 font-medium text-slate-900">{r.date || "N/A"}</td>
                        <td className="px-3 py-2">{formatLitres(r.litres)}</td>
                        <td className="px-3 py-2">{formatCurrency(r.pricePerLitre)}</td>
                        <td className="px-3 py-2 font-semibold">{formatCurrency(r.totalAmount)}</td>
                        <td className="px-3 py-2">{formatPercentage(r.fat)}</td>
                        <td className="px-3 py-2">
                          {r.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600" title={r.error}>
                              <AlertCircle className="h-3 w-3" /> {r.error}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isPending || validRows.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-950/20 hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            <span>{isPending ? "Importing..." : `Import ${validRows.length} Records`}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
