import { getCurrentUser } from "@/app/api/lib/auth";
import prisma from "@/lib/prisma";

export async function getPomodoroRecordsByDB() {
  try {
    const user = await getCurrentUser();
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
