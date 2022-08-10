/*
  Warnings:

  - You are about to drop the column `priceWidthDiscount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "priceWidthDiscount",
ADD COLUMN     "priceWithDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
