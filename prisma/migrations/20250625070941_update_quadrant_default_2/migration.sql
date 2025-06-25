/*
  Warnings:

  - The `quadrant` column on the `dawn_tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "QuadrantType" AS ENUM ('q1', 'q2', 'q3', 'q4');

-- AlterTable
ALTER TABLE "dawn_tasks" DROP COLUMN "quadrant",
ADD COLUMN     "quadrant" "QuadrantType" NOT NULL DEFAULT 'q1';
