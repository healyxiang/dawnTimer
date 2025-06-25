import { getCurrentUser } from "@/app/api/lib/auth";
import { getTasksByDB } from "@/app/api/lib/pomodoro";
import prisma from "@/lib/prisma";
import { successResponse, apiResponses } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

// GET /api/pomodoro/tasks
export async function GET() {
  try {
    const tasks = await getTasksByDB();
    return successResponse(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return apiResponses.unauthorized();
  }
}

// POST /api/pomodoro/tasks
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return apiResponses.badRequest("User did not login");
    }
    const body = await request.json();
    const { title, description, skillIds, quadrant, completed } = body;

    if (!title) {
      return apiResponses.badRequest("Title is required");
    }

    const taskData: Prisma.TaskCreateInput = {
      title,
      description,
      quadrant,
      completed: completed || false,
      user: { connect: { id: user.id } },
      ...(skillIds &&
        skillIds.length > 0 && {
          skills: {
            connect: skillIds.map((id: string) => ({ id })),
          },
        }),
    };

    const task = await prisma.task.create({
      data: taskData,
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

    return successResponse(task, "Task created successfully");
  } catch (error) {
    console.error("Error creating task:", error);
    return apiResponses.internalError("Failed to create task");
  }
}

// PUT /api/pomodoro/tasks
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return apiResponses.badRequest("User did not login");
    }
    const body = await request.json();
    const { id, title, description, skillIds, quadrant, completed } = body;

    if (!id) {
      return apiResponses.badRequest("Task ID is required");
    }

    const taskData: Prisma.TaskUpdateInput = {
      title,
      description,
      quadrant,
      completed,
      ...(skillIds &&
        skillIds.length > 0 && {
          skills: {
            set: [], // 清除现有关联
            connect: skillIds.map((id: string) => ({ id })),
          },
        }),
    };

    const task = await prisma.task.update({
      where: {
        id,
        userId: user.id,
      },
      data: taskData,
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

    return successResponse(task, "Task updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);
    return apiResponses.internalError("Failed to update task");
  }
}

// DELETE /api/pomodoro/tasks
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return apiResponses.badRequest("User did not login");
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return apiResponses.badRequest("Task ID is required");
    }

    await prisma.task.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isDeleted: true,
      },
    });

    return successResponse(null, "Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    return apiResponses.internalError("Failed to delete task");
  }
}
