-- CreateEnum
CREATE TYPE "ResumeExtractionStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "application_resume" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "checkSumSha256" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_extraction" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "runNumber" INTEGER NOT NULL DEFAULT 1,
    "status" "ResumeExtractionStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryAttempts" INTEGER NOT NULL DEFAULT 1,
    "extractedText" TEXT NOT NULL,
    "structuredData" JSONB,
    "extractorName" TEXT,
    "extractorVersion" TEXT,
    "llmProvider" TEXT,
    "llmModel" TEXT,
    "promptVersion" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_extraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_event" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "lastError" TEXT,

    CONSTRAINT "outbox_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_resume_applicationId_uploadedAt_idx" ON "application_resume"("applicationId", "uploadedAt");

-- CreateIndex
CREATE UNIQUE INDEX "application_resume_applicationId_version_key" ON "application_resume"("applicationId", "version");

-- CreateIndex
CREATE INDEX "resume_extraction_resumeId_createdAt_idx" ON "resume_extraction"("resumeId", "createdAt");

-- CreateIndex
CREATE INDEX "resume_extraction_status_createdAt_idx" ON "resume_extraction"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "resume_extraction_resumeId_runNumber_key" ON "resume_extraction"("resumeId", "runNumber");

-- CreateIndex
CREATE INDEX "outbox_event_publishedAt_nextAttemptAt_createdAt_idx" ON "outbox_event"("publishedAt", "nextAttemptAt", "createdAt");

-- AddForeignKey
ALTER TABLE "application_resume" ADD CONSTRAINT "application_resume_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_extraction" ADD CONSTRAINT "resume_extraction_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "application_resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
