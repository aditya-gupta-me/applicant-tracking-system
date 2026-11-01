-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");
