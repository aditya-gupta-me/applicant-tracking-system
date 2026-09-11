/*
  Warnings:

  - The `proficiencyLevel` column on the `candidate_skill` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- AlterTable
ALTER TABLE "candidate_skill" DROP COLUMN "proficiencyLevel",
ADD COLUMN     "proficiencyLevel" "ProficiencyLevel";
