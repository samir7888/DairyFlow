import type { Metadata } from "next";
import { getMilkSaleByIdAction } from "@/lib/actions/milk-sales";
import { MilkSaleForm } from "@/components/records/milk-sale-form";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Milk Sale Record",
  description: "Modify existing milk sale entry volume, price per litre, fat content, or invoice date.",
};

interface EditRecordPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRecordPage({ params }: EditRecordPageProps) {
  const { id } = await params;
  const record = await getMilkSaleByIdAction(id);

  if (!record) {
    redirect("/records");
  }

  return (
    <div className="py-4">
      <MilkSaleForm initialData={record} isEditing />
    </div>
  );
}
