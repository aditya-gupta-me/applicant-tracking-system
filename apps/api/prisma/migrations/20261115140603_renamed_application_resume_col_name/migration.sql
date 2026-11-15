/*
  Warnings:

  - You are about to drop the column `originalName` on the `application_resume` table. All the data in the column will be lost.
  - Added the required column `originalFileName` to the `application_resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "application_resume" DROP COLUMN "originalName",
ADD COLUMN     "originalFileName" TEXT NOT NULL;
