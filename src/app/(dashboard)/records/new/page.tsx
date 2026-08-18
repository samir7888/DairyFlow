import type { Metadata } from "next";
import { MilkSaleForm } from "@/components/records/milk-sale-form";

export const metadata: Metadata = {
  title: "Record New Milk Sale",
  description:
    "Log daily milk sales receipts: volume in litres, price per litre in NPR, fat percentage, and calculate total revenue.",
};

export default function NewRecordPage() {
  return (
    <div className="py-4">
      <MilkSaleForm />
    </div>
  );
}
