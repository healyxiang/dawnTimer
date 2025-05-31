import { getCurrentUser } from "@/app/api/lib/auth";
import prisma from "@/lib/prisma";

export async function getPomodoroRecordsByDB() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }
    const records = await prisma.timerRecord.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return records;
  } catch (error) {
    console.error("getPomodoroRecords lib error:", error);
    return [];
  }
}

export async function getTasksByDB() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }
    const tasks = await prisma.task.findMany({
      where: { userId: user.id, isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        skills: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
          },
        },
      },
    });
    return tasks;
  } catch (error) {
    console.error("getTasksByDB lib error:", error);
    return [];
  }
}
