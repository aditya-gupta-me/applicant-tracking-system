-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_candidateId_jobId_key" ON "application"("candidateId", "jobId");

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
