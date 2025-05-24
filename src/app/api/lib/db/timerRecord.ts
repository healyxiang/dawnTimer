import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/app/api/lib/auth";

export async function getTimerRecords() {
  const user = await getCurrentUser();
  return prisma.timerRecord.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTimerRecord(data: {
  taskId?: string;
  skillId?: string;
  duration: number;
  type: string;
  completed?: boolean;
  startTime: string | Date;
  endTime: string | Date;
  round?: number;
}) {
  const user = await getCurrentUser();
  const recordData: Prisma.TimerRecordCreateInput = {
    duration: data.duration,
    type: data.type,
    completed: data.completed,
    startTime: data.startTime,
    endTime: data.endTime,
    round: data.round,
    user: { connect: { id: user.id } },
    ...(data.taskId && { task: { connect: { id: data.taskId } } }),
    ...(data.skillId && { skill: { connect: { id: data.skillId } } }),
  };

  return prisma.timerRecord.create({
    data: recordData,
  });
}

export async function deleteAllTimerRecords() {
  const user = await getCurrentUser();
  return prisma.timerRecord.deleteMany({
    where: { userId: user.id },
  });
}
