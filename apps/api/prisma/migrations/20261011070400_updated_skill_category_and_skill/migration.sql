/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,normalizedName]` on the table `skill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,categoryName]` on the table `skill_category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,id]` on the table `skill_category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `skill_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "skill" DROP CONSTRAINT "skill_categoryId_fkey";

-- DropIndex
DROP INDEX "skill_normalizedName_key";

-- DropIndex
DROP INDEX "skill_category_categoryName_key";

-- AlterTable
ALTER TABLE "skill" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "skill_category" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "skill_organizationId_idx" ON "skill"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_organizationId_normalizedName_key" ON "skill"("organizationId", "normalizedName");

-- CreateIndex
CREATE INDEX "skill_category_organizationId_idx" ON "skill_category"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_category_organizationId_categoryName_key" ON "skill_category"("organizationId", "categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "skill_category_organizationId_id_key" ON "skill_category"("organizationId", "id");

-- AddForeignKey
ALTER TABLE "skill_category" ADD CONSTRAINT "skill_category_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_organizationId_categoryId_fkey" FOREIGN KEY ("organizationId", "categoryId") REFERENCES "skill_category"("organizationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
