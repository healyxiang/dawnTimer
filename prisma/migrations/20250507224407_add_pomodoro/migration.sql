/*
  Warnings:

  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "tasks";

-- DropEnum
DROP TYPE "TaskStatus";

-- DropEnum
DROP TYPE "TaskType";

-- CreateTable
CREATE TABLE "dawn_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "pomodoroRatings" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "dawn_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timer_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pomodoroLength" INTEGER NOT NULL,
    "shortBreakLength" INTEGER NOT NULL,
    "longBreakLength" INTEGER NOT NULL,
    "autoStartBreaks" BOOLEAN NOT NULL DEFAULT false,
    "autoStartPomodoros" BOOLEAN NOT NULL DEFAULT false,
    "longBreakInterval" INTEGER NOT NULL DEFAULT 4,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "timer_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timer_records" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "timer_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timer_presets_user_id_isDefault_key" ON "timer_presets"("user_id", "isDefault");
