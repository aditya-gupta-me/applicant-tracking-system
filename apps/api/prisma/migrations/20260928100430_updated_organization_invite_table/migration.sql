/*
  Warnings:

  - You are about to drop the column `skillsId` on the `candidate_skill` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `organization_admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[candidateId,skillId]` on the table `candidate_skill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,id]` on the table `department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminId]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `skillId` to the `candidate_skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminId` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizationMemberRole" AS ENUM ('ADMIN', 'RECRUITER', 'HIRING_MANAGER');

-- CreateEnum
CREATE TYPE "OrganizationInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED');

-- DropForeignKey
ALTER TABLE "candidate_skill" DROP CONSTRAINT "candidate_skill_skillsId_fkey";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "organization_admin" DROP CONSTRAINT "organization_admin_adminId_fkey";

-- DropForeignKey
ALTER TABLE "organization_admin" DROP CONSTRAINT "organization_admin_orgId_fkey";

-- DropForeignKey
ALTER TABLE "skill" DROP CONSTRAINT "skill_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_organizationId_fkey";

-- DropIndex
DROP INDEX "candidate_skill_candidateId_skillsId_key";

-- DropIndex
DROP INDEX "candidate_skill_skillsId_idx";

-- DropIndex
DROP INDEX "user_organizationId_idx";

-- AlterTable
ALTER TABLE "candidate_skill" DROP COLUMN "skillsId",
ADD COLUMN     "skillId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "organizationId",
DROP COLUMN "role";

-- DropTable
DROP TABLE "organization_admin";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "organization_members" (
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "role" "OrganizationMemberRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("userId","orgId")
);

-- CreateTable
CREATE TABLE "organization_invites" (
    "inviteToken" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "OrganizationMemberRole" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "OrganizationInviteStatus" NOT NULL,

    CONSTRAINT "organization_invites_pkey" PRIMARY KEY ("inviteToken")
);

-- CreateIndex
CREATE INDEX "organization_members_orgId_idx" ON "organization_members"("orgId");

-- CreateIndex
CREATE INDEX "candidate_skill_skillId_idx" ON "candidate_skill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_skill_candidateId_skillId_key" ON "candidate_skill"("candidateId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "department_organizationId_id_key" ON "department"("organizationId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_adminId_key" ON "organizations"("adminId");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_organizationId_departmentId_fkey" FOREIGN KEY ("organizationId", "departmentId") REFERENCES "department"("organizationId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_skill" ADD CONSTRAINT "candidate_skill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "skill_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
