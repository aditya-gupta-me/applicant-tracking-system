/*
  Warnings:

  - You are about to drop the `OrganizationAdmin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationAdmin" DROP CONSTRAINT "OrganizationAdmin_adminId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationAdmin" DROP CONSTRAINT "OrganizationAdmin_orgId_fkey";

-- DropTable
DROP TABLE "OrganizationAdmin";

-- CreateTable
CREATE TABLE "organization_admin" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "organization_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_admin_orgId_key" ON "organization_admin"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "organization_admin_adminId_key" ON "organization_admin"("adminId");

-- AddForeignKey
ALTER TABLE "organization_admin" ADD CONSTRAINT "organization_admin_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_admin" ADD CONSTRAINT "organization_admin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
