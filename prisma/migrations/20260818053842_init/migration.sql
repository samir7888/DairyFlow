-- CreateTable
CREATE TABLE "MilkSale" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "litres" DECIMAL(10,2) NOT NULL,
    "pricePerLitre" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "fat" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MilkSale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MilkSale_userId_idx" ON "MilkSale"("userId");

-- CreateIndex
CREATE INDEX "MilkSale_userId_date_idx" ON "MilkSale"("userId", "date");
