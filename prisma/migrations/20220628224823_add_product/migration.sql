/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "headline" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "priceWidthDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT E'';

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
