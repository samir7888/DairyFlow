"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { milkSaleSchema, MilkSaleFormValues } from "@/lib/validations/milk-sale";
import { DateRangePreset, getDateRangeBounds } from "@/lib/utils";
import { isClerkConfigured } from "@/lib/clerk-config";
import Decimal from "decimal.js";
import prisma from "@/lib/prisma";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

interface MilkSaleDbRow {
  id: string;
  userId: string;
  date: Date;
  litres: Decimal | number | { toNumber(): number };
  pricePerLitre: Decimal | number | { toNumber(): number };
  totalAmount: Decimal | number | { toNumber(): number };
  fat: Decimal | number | { toNumber(): number };
}

/**
 * Get current authenticated user ID from Clerk.
 * Uses dev_local_user fallback if Clerk keys are not configured yet in .env
 */
async function getAuthUserId(): Promise<string> {
  if (!isClerkConfigured()) {
    return "dev_local_user";
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized access. Please sign in.");
  }
  return userId;
}

/**
 * Create a new Milk Sale record.
 */
export async function createMilkSaleAction(
  formData: MilkSaleFormValues
): Promise<ActionResult> {
  try {
    const userId = await getAuthUserId();

    // Server-side Zod validation
    const validated = milkSaleSchema.parse(formData);

    // Calculate totalAmount safely on server
    const calculatedTotal = new Decimal(validated.litres)
      .mul(new Decimal(validated.pricePerLitre))
      .toDecimalPlaces(2);
    
    const finalTotal = new Decimal(validated.totalAmount || calculatedTotal.toNumber());

    const record = await prisma.milkSale.create({
      data: {
        userId,
        date: new Date(validated.date),
        litres: new Decimal(validated.litres),
        pricePerLitre: new Decimal(validated.pricePerLitre),
        totalAmount: finalTotal,
        fat: new Decimal(validated.fat),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/records");
    revalidatePath("/analytics");

    return {
      success: true,
      data: {
        id: record.id,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create milk sale record.";
    return { success: false, error: message };
  }
}

/**
 * Batch import multiple Milk Sale records from a CSV file.
 */
export async function importMilkSalesCSVAction(
  records: MilkSaleFormValues[]
): Promise<ActionResult<{ count: number }>> {
  try {
    const userId = await getAuthUserId();

    if (!Array.isArray(records) || records.length === 0) {
      return { success: false, error: "No valid records found in CSV file." };
    }

    const validatedRecords = [];
    for (let i = 0; i < records.length; i++) {
      const item = records[i];
      const validated = milkSaleSchema.parse(item);

      const calculatedTotal = new Decimal(validated.litres)
        .mul(new Decimal(validated.pricePerLitre))
        .toDecimalPlaces(2);
      const finalTotal = new Decimal(validated.totalAmount || calculatedTotal.toNumber());

      validatedRecords.push({
        userId,
        date: new Date(validated.date),
        litres: new Decimal(validated.litres),
        pricePerLitre: new Decimal(validated.pricePerLitre),
        totalAmount: finalTotal,
        fat: new Decimal(validated.fat),
      });
    }

    const result = await prisma.milkSale.createMany({
      data: validatedRecords,
    });

    revalidatePath("/dashboard");
    revalidatePath("/records");
    revalidatePath("/analytics");

    return {
      success: true,
      data: { count: result.count },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to import CSV records.";
    return { success: false, error: message };
  }
}

/**
 * Update an existing Milk Sale record.
 * Validates ownership before performing update.
 */
export async function updateMilkSaleAction(
  id: string,
  formData: MilkSaleFormValues
): Promise<ActionResult> {
  try {
    const userId = await getAuthUserId();

    // Verify record exists and belongs to the authenticated user
    const existingRecord = await prisma.milkSale.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingRecord) {
      return { success: false, error: "Record not found or access denied." };
    }

    const validated = milkSaleSchema.parse(formData);

    const updatedRecord = await prisma.milkSale.update({
      where: {
        id,
      },
      data: {
        date: new Date(validated.date),
        litres: new Decimal(validated.litres),
        pricePerLitre: new Decimal(validated.pricePerLitre),
        totalAmount: new Decimal(validated.totalAmount),
        fat: new Decimal(validated.fat),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/records");
    revalidatePath(`/records/${id}/edit`);
    revalidatePath("/analytics");

    return {
      success: true,
      data: { id: updatedRecord.id },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update record.";
    return { success: false, error: message };
  }
}

/**
 * Delete a Milk Sale record.
 * Validates ownership before deletion.
 */
export async function deleteMilkSaleAction(id: string): Promise<ActionResult> {
  try {
    const userId = await getAuthUserId();

    const existingRecord = await prisma.milkSale.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingRecord) {
      return { success: false, error: "Record not found or access denied." };
    }

    await prisma.milkSale.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/records");
    revalidatePath("/analytics");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete record.";
    return { success: false, error: message };
  }
}

/**
 * Fetch a single record by ID, scoped to user.
 */
export async function getMilkSaleByIdAction(id: string) {
  try {
    const userId = await getAuthUserId();

    const record = await prisma.milkSale.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!record) return null;

    const row = record as unknown as MilkSaleDbRow;

    return {
      id: row.id,
      userId: row.userId,
      date: row.date.toISOString().split("T")[0],
      litres: typeof row.litres === "number" ? row.litres : row.litres.toNumber(),
      pricePerLitre: typeof row.pricePerLitre === "number" ? row.pricePerLitre : row.pricePerLitre.toNumber(),
      totalAmount: typeof row.totalAmount === "number" ? row.totalAmount : row.totalAmount.toNumber(),
      fat: typeof row.fat === "number" ? row.fat : row.fat.toNumber(),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch paginated, searchable, date-filtered sales records.
 */
export async function getMilkSalesAction(params: {
  range?: DateRangePreset;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const userId = await getAuthUserId();
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const { startDate, endDate } = getDateRangeBounds(params.range || "all", params.from, params.to);

  const whereClause: {
    userId: string;
    date?: { gte?: Date; lte?: Date };
  } = {
    userId,
  };

  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = startDate;
    if (endDate) whereClause.date.lte = endDate;
  }

  const [totalCount, items] = await Promise.all([
    prisma.milkSale.count({ where: whereClause }),
    prisma.milkSale.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
  ]);

  const formattedItems = items.map((item: unknown) => {
    const row = item as MilkSaleDbRow;
    return {
      id: row.id,
      userId: row.userId,
      date: row.date,
      litres: typeof row.litres === "number" ? row.litres : row.litres.toNumber(),
      pricePerLitre: typeof row.pricePerLitre === "number" ? row.pricePerLitre : row.pricePerLitre.toNumber(),
      totalAmount: typeof row.totalAmount === "number" ? row.totalAmount : row.totalAmount.toNumber(),
      fat: typeof row.fat === "number" ? row.fat : row.fat.toNumber(),
    };
  });

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    items: formattedItems,
    totalCount,
    totalPages,
    currentPage: page,
  };
}

/**
 * Fetch aggregated statistics and aggregated charts for Dashboard view.
 */
export async function getDashboardDataAction(params: {
  range?: DateRangePreset;
  from?: string;
  to?: string;
}) {
  const userId = await getAuthUserId();
  const { startDate, endDate } = getDateRangeBounds(params.range || "last30days", params.from, params.to);

  const whereClause: {
    userId: string;
    date?: { gte?: Date; lte?: Date };
  } = {
    userId,
  };

  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = startDate;
    if (endDate) whereClause.date.lte = endDate;
  }

  // Retrieve matching records
  const records = await prisma.milkSale.findMany({
    where: whereClause,
    orderBy: { date: "asc" },
  });

  // Calculate summary metrics
  let totalLitres = new Decimal(0);
  let totalEarnings = new Decimal(0);
  let totalFatWeighted = new Decimal(0);

  // Group by date for Chart aggregated points
  const aggregatedByDateMap = new Map<
    string,
    { litres: Decimal; earnings: Decimal; fatSum: Decimal; count: number }
  >();

  for (const r of records) {
    const litresDec = new Decimal(r.litres.toString());
    const totalAmountDec = new Decimal(r.totalAmount.toString());
    const fatDec = new Decimal(r.fat.toString());

    totalLitres = totalLitres.add(litresDec);
    totalEarnings = totalEarnings.add(totalAmountDec);
    totalFatWeighted = totalFatWeighted.add(fatDec.mul(litresDec));

    // Format YYYY-MM-DD
    const dateKey = r.date.toISOString().split("T")[0];
    const existing = aggregatedByDateMap.get(dateKey) || {
      litres: new Decimal(0),
      earnings: new Decimal(0),
      fatSum: new Decimal(0),
      count: 0,
    };

    aggregatedByDateMap.set(dateKey, {
      litres: existing.litres.add(litresDec),
      earnings: existing.earnings.add(totalAmountDec),
      fatSum: existing.fatSum.add(fatDec),
      count: existing.count + 1,
    });
  }

  const recordCount = records.length;
  const avgPricePerLitre = totalLitres.gt(0)
    ? totalEarnings.div(totalLitres).toDecimalPlaces(2).toNumber()
    : 0;

  const avgFat = totalLitres.gt(0)
    ? totalFatWeighted.div(totalLitres).toDecimalPlaces(2).toNumber()
    : recordCount > 0
    ? totalFatWeighted.div(recordCount).toDecimalPlaces(2).toNumber()
    : 0;

  // Chart data series sorted chronologically
  const chartData = Array.from(aggregatedByDateMap.entries())
    .map(([dateStr, val]) => ({
      date: dateStr,
      displayDate: new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      litres: val.litres.toNumber(),
      earnings: val.earnings.toNumber(),
      avgFat: val.fatSum.div(val.count).toDecimalPlaces(2).toNumber(),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Get latest 5 records for recent table
  const recentRecords = records
    .slice()
    .reverse()
    .slice(0, 5)
    .map((r: unknown) => {
      const row = r as MilkSaleDbRow;
      return {
        id: row.id,
        date: row.date,
        litres: typeof row.litres === "number" ? row.litres : row.litres.toNumber(),
        pricePerLitre: typeof row.pricePerLitre === "number" ? row.pricePerLitre : row.pricePerLitre.toNumber(),
        totalAmount: typeof row.totalAmount === "number" ? row.totalAmount : row.totalAmount.toNumber(),
        fat: typeof row.fat === "number" ? row.fat : row.fat.toNumber(),
      };
    });

  return {
    summary: {
      totalLitres: totalLitres.toNumber(),
      totalEarnings: totalEarnings.toNumber(),
      avgPricePerLitre,
      avgFat,
      recordCount,
    },
    chartData,
    recentRecords,
  };
}

/**
 * Fetch detailed analytical metrics for Analytics page.
 */
export async function getAnalyticsDataAction(params: {
  range?: DateRangePreset;
  from?: string;
  to?: string;
}) {
  const userId = await getAuthUserId();
  const { startDate, endDate } = getDateRangeBounds(params.range || "all", params.from, params.to);

  const whereClause: {
    userId: string;
    date?: { gte?: Date; lte?: Date };
  } = {
    userId,
  };

  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = startDate;
    if (endDate) whereClause.date.lte = endDate;
  }

  const records = await prisma.milkSale.findMany({
    where: whereClause,
    orderBy: { date: "asc" },
  });

  let totalLitres = new Decimal(0);
  let totalEarnings = new Decimal(0);
  let totalFatWeighted = new Decimal(0);

  let highestSale: { date: Date; litres: number } | null = null;
  let highestEarningDay: { date: Date; amount: number } | null = null;

  // Group by date to find highest earning day and aggregate series
  const dateAggMap = new Map<
    string,
    { dateObj: Date; litres: Decimal; earnings: Decimal; fatSum: Decimal; count: number }
  >();

  for (const r of records) {
    const litresDec = new Decimal(r.litres.toString());
    const totalDec = new Decimal(r.totalAmount.toString());
    const fatDec = new Decimal(r.fat.toString());

    totalLitres = totalLitres.add(litresDec);
    totalEarnings = totalEarnings.add(totalDec);
    totalFatWeighted = totalFatWeighted.add(fatDec.mul(litresDec));

    // Highest single sale volume
    if (!highestSale || litresDec.toNumber() > highestSale.litres) {
      highestSale = {
        date: r.date,
        litres: litresDec.toNumber(),
      };
    }

    const dateKey = r.date.toISOString().split("T")[0];
    const existing = dateAggMap.get(dateKey) || {
      dateObj: r.date,
      litres: new Decimal(0),
      earnings: new Decimal(0),
      fatSum: new Decimal(0),
      count: 0,
    };

    dateAggMap.set(dateKey, {
      dateObj: r.date,
      litres: existing.litres.add(litresDec),
      earnings: existing.earnings.add(totalDec),
      fatSum: existing.fatSum.add(fatDec),
      count: existing.count + 1,
    });
  }

  // Find highest earning day
  for (const [, val] of dateAggMap.entries()) {
    if (!highestEarningDay || val.earnings.toNumber() > highestEarningDay.amount) {
      highestEarningDay = {
        date: val.dateObj,
        amount: val.earnings.toNumber(),
      };
    }
  }

  const sellingDaysCount = dateAggMap.size;
  const avgDailyMilk = sellingDaysCount > 0 ? totalLitres.div(sellingDaysCount).toDecimalPlaces(2).toNumber() : 0;
  const avgFat = totalLitres.gt(0)
    ? totalFatWeighted.div(totalLitres).toDecimalPlaces(2).toNumber()
    : 0;

  const chartSeries = Array.from(dateAggMap.entries())
    .map(([dateStr, val]) => ({
      date: dateStr,
      displayDate: new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      litres: val.litres.toNumber(),
      earnings: val.earnings.toNumber(),
      fat: val.fatSum.div(val.count).toDecimalPlaces(2).toNumber(),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    summary: {
      totalLitres: totalLitres.toNumber(),
      totalEarnings: totalEarnings.toNumber(),
      avgDailyMilk,
      avgFat,
      highestSale,
      highestEarningDay,
      sellingDaysCount,
    },
    chartSeries,
  };
}
