import { getCurrentUser } from "@/app/api/lib/auth";
import prisma from "@/lib/prisma";
import { getPomodoroRecordsByDB } from "@/app/api/lib/pomodoro";
import { successResponse, apiResponses } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const records = await getPomodoroRecordsByDB();
    return successResponse(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return apiResponses.unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const {
      taskId,
      skillId,
      duration,
      type,
      completed,
      startTime,
      endTime,
      round,
    } = body;

    if (!duration) {
      return apiResponses.badRequest("Duration is required");
    }

    if (!type) {
      return apiResponses.badRequest("Type is required");
    }

    const recordData: Prisma.TimerRecordCreateInput = {
      duration,
      type,
      completed,
      startTime,
      endTime,
      round,
      user: { connect: { id: user.id } },
      ...(taskId && { task: { connect: { id: taskId } } }),
      ...(skillId && { skill: { connect: { id: skillId } } }),
    };

    const record = await prisma.timerRecord.create({
      data: recordData,
    });

    return successResponse(record, "Record created successfully");
  } catch (error) {
    console.error("Error creating record:", error);
    return apiResponses.internalError("Failed to create record");
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    await prisma.timerRecord.deleteMany({
      where: { userId: user.id },
    });

    return successResponse(null, "All records deleted successfully");
  } catch (error) {
    console.error("Error deleting records:", error);
    return apiResponses.internalError("Failed to delete records");
  }
}
