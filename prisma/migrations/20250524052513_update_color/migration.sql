/*
  Warnings:

  - Made the column `color` on table `skills` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "skills" ALTER COLUMN "color" SET NOT NULL;
