import { successResponse, apiResponses } from "@/lib/api-response";
import {
  getTimerRecords,
  createTimerRecord,
  deleteAllTimerRecords,
} from "@/app/api/lib/db/timerRecord";

export async function GET() {
  try {
    const records = await getTimerRecords();
    return successResponse(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return apiResponses.unauthorized();
  }
}

export async function POST(request: Request) {
  try {
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

    const record = await createTimerRecord({
      taskId,
      skillId,
      duration,
      type,
      completed,
      startTime,
      endTime,
      round,
    });

    return successResponse(record, "Record created successfully");
  } catch (error) {
    console.error("Error creating record:", error);
    return apiResponses.internalError("Failed to create record");
  }
}

export async function DELETE() {
  try {
    await deleteAllTimerRecords();
    return successResponse(null, "All records deleted successfully");
  } catch (error) {
    console.error("Error deleting records:", error);
    return apiResponses.internalError("Failed to delete records");
  }
}
