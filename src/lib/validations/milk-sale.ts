import { z } from "zod";

export const milkSaleSchema = z.object({
  date: z.string().min(1, "Date is required"),
  litres: z
    .number()
    .gt(0, "Milk quantity must be greater than 0"),
  pricePerLitre: z
    .number()
    .gte(0, "Price per litre cannot be negative"),
  totalAmount: z
    .number()
    .gte(0, "Total amount cannot be negative"),
  fat: z
    .number()
    .gt(0, "Fat percentage must be greater than 0")
    .lte(25, "Fat percentage is unusually high"),
});

export type MilkSaleFormValues = z.infer<typeof milkSaleSchema>;
