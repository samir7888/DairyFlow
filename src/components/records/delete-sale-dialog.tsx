"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { deleteMilkSaleAction } from "@/lib/actions/milk-sales";
import { formatCurrency, formatDate, formatLitres } from "@/lib/utils";

interface DeleteSaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    id: string;
    date: Date | string;
    litres: number;
    totalAmount: number;
  } | null;
  onSuccess?: () => void;
}

export function DeleteSaleDialog({
  isOpen,
  onClose,
  record,
  onSuccess,
}: DeleteSaleDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !record) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteMilkSaleAction(record.id);
      if (res.success) {
        toast.success("Milk sale record deleted successfully!");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error || "Failed to delete record.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Delete Milk Sale Record?
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Are you sure you want to delete this milk sale record? This action cannot be undone.
        </p>

        {/* Record Details summary card */}
        <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Date:</span>
            <span className="font-semibold text-slate-900">{formatDate(record.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Milk Volume:</span>
            <span className="font-semibold text-emerald-800">{formatLitres(record.litres)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Amount:</span>
            <span className="font-bold text-slate-900">{formatCurrency(record.totalAmount)}</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
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
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-950/20 hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isPending ? "Deleting..." : "Confirm Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
