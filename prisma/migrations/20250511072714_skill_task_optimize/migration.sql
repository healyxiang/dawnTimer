-- AlterTable
ALTER TABLE "dawn_tasks" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "timer_records" ADD COLUMN     "skillIds" TEXT[];
