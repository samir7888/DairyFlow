"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Milk, Banknote, Percent, Tag, Save, ArrowLeft, RefreshCw } from "lucide-react";
import { createMilkSaleAction, updateMilkSaleAction } from "@/lib/actions/milk-sales";
import { calculateTotalAmount, formatCurrency } from "@/lib/utils";

interface MilkSaleFormProps {
  initialData?: {
    id: string;
    date: string;
    litres: number;
    pricePerLitre: number;
    totalAmount: number;
    fat: number;
  };
  isEditing?: boolean;
}

export function MilkSaleForm({ initialData, isEditing = false }: MilkSaleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const todayStr = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(initialData?.date || todayStr);
  const [litres, setLitres] = useState<string>(initialData ? String(initialData.litres) : "");
  const [pricePerLitre, setPricePerLitre] = useState<string>(
    initialData ? String(initialData.pricePerLitre) : ""
  );
  const [totalAmount, setTotalAmount] = useState<string>(
    initialData ? String(initialData.totalAmount) : ""
  );
  const [isTotalManuallyEdited, setIsTotalManuallyEdited] = useState(false);
  const [fat, setFat] = useState<string>(initialData ? String(initialData.fat) : "");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-calculate Total Amount live when Litres or Price changes (unless user manually overrode it)
  useEffect(() => {
    if (!isTotalManuallyEdited) {
      const numLitres = parseFloat(litres);
      const numPrice = parseFloat(pricePerLitre);
      if (!isNaN(numLitres) && !isNaN(numPrice) && numLitres > 0 && numPrice >= 0) {
        const calculated = calculateTotalAmount(numLitres, numPrice);
        setTotalAmount(String(calculated));
      }
    }
  }, [litres, pricePerLitre, isTotalManuallyEdited]);

  const handleRecalculateTotal = () => {
    const numLitres = parseFloat(litres);
    const numPrice = parseFloat(pricePerLitre);
    if (!isNaN(numLitres) && !isNaN(numPrice) && numLitres > 0 && numPrice >= 0) {
      const calculated = calculateTotalAmount(numLitres, numPrice);
      setTotalAmount(String(calculated));
      setIsTotalManuallyEdited(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const numLitres = parseFloat(litres);
    const numPrice = parseFloat(pricePerLitre);
    const numTotal = parseFloat(totalAmount);
    const numFat = parseFloat(fat);

    const newErrors: { [key: string]: string } = {};

    if (!date) newErrors.date = "Date is required.";
    if (isNaN(numLitres) || numLitres <= 0) newErrors.litres = "Milk quantity must be greater than 0.";
    if (isNaN(numPrice) || numPrice < 0) newErrors.pricePerLitre = "Price per litre cannot be negative.";
    if (isNaN(numTotal) || numTotal < 0) newErrors.totalAmount = "Total amount cannot be negative.";
    if (isNaN(numFat) || numFat <= 0) newErrors.fat = "Fat percentage must be greater than 0.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the errors in the form.");
      return;
    }

    const payload = {
      date,
      litres: numLitres,
      pricePerLitre: numPrice,
      totalAmount: numTotal,
      fat: numFat,
    };

    startTransition(async () => {
      let res;
      if (isEditing && initialData?.id) {
        res = await updateMilkSaleAction(initialData.id, payload);
      } else {
        res = await createMilkSaleAction(payload);
      }

      if (res.success) {
        toast.success(
          isEditing ? "Milk sale record updated successfully!" : "Milk sale record saved successfully!"
        );
        router.push("/records");
      } else {
        toast.error(res.error || "An error occurred while saving the record.");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Records</span>
        </button>
        <span className="text-xs text-slate-400 font-medium">* All fields are required</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEditing ? "Edit Milk Sale Record" : "Record New Milk Sale"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter details from your dairy invoice receipt (volume, price, fat content)
          </p>
        </div>

        {/* Date Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Invoice Date <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
              required
            />
          </div>
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Milk Quantity Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Milk Quantity (Litres) <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Milk className="h-4 w-4 text-emerald-600" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 18.50"
                value={litres}
                onChange={(e) => setLitres(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                required
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
                L
              </span>
            </div>
            {errors.litres && <p className="mt-1 text-xs text-red-600">{errors.litres}</p>}
          </div>

          {/* Price per Litre Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Price per Litre (NPR) <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="h-4 w-4 text-emerald-600" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 65.00"
                value={pricePerLitre}
                onChange={(e) => setPricePerLitre(e.target.value)}
                className="w-full pl-10 pr-14 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                required
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
                NPR/L
              </span>
            </div>
            {errors.pricePerLitre && <p className="mt-1 text-xs text-red-600">{errors.pricePerLitre}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Amount Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Total Amount (NPR) <span className="text-emerald-600">*</span>
              </label>
              {isTotalManuallyEdited && (
                <button
                  type="button"
                  onClick={handleRecalculateTotal}
                  className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Auto-recalculate
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Banknote className="h-4 w-4 text-emerald-600" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1202.50"
                value={totalAmount}
                onChange={(e) => {
                  setTotalAmount(e.target.value);
                  setIsTotalManuallyEdited(true);
                }}
                className="w-full pl-10 pr-14 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                required
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
                NPR
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Live calculated: {litres && pricePerLitre ? formatCurrency(calculateTotalAmount(parseFloat(litres), parseFloat(pricePerLitre))) : "NPR 0.00"}
            </p>
            {errors.totalAmount && <p className="mt-1 text-xs text-red-600">{errors.totalAmount}</p>}
          </div>

          {/* Milk Fat Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Milk Fat (%) <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Percent className="h-4 w-4 text-emerald-600" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="25"
                placeholder="e.g. 4.2"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                required
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
                %
              </span>
            </div>
            {errors.fat && <p className="mt-1 text-xs text-red-600">{errors.fat}</p>}
          </div>
        </div>

        {/* Live Calculation Preview Banner */}
        {litres && pricePerLitre && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border border-emerald-100 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-emerald-950">Calculated Invoice Summary</div>
              <div className="text-slate-600">
                {litres} Litres × NPR {pricePerLitre}/L @ {fat || "0"}% Fat
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-emerald-900">
                {formatCurrency(parseFloat(totalAmount) || 0)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push("/records")}
            disabled={isPending}
            className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950/20 hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isPending ? "Saving Record..." : isEditing ? "Update Record" : "Save Record"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
