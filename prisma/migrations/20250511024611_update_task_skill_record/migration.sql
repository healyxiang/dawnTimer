/*
  Warnings:

  - Added the required column `duration` to the `timer_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "timer_records" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "round" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "taskId" TEXT;

-- CreateTable
CREATE TABLE "_SkillToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SkillToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SkillToTask_B_index" ON "_SkillToTask"("B");
