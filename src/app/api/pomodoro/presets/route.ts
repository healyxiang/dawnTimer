import { getCurrentUser } from "@/app/api/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, apiResponses } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

// import { DEFAULT_PRESETS } from "@/constants/pomodoro";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return apiResponses.unauthorized();
    }
    const presets = await prisma.timerPreset.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(
      //   [...DEFAULT_PRESETS, ...presets],
      presets,
      "Presets fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching presets:", error);
    return apiResponses.unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return apiResponses.badRequest("User did not login");
    }
    const body = await request.json();
    const {
      name,
      pomodoroLength,
      shortBreakLength,
      longBreakLength,
      longBreakInterval,
    } = body;

    if (!name) {
      return apiResponses.badRequest("Name is required");
    }

    const presetData: Prisma.TimerPresetCreateInput = {
      name,
      pomodoroLength,
      shortBreakLength,
      longBreakLength,
      longBreakInterval,
      user: { connect: { id: user.id } },
    };

    const preset = await prisma.timerPreset.create({
      data: presetData,
    });

    return successResponse(preset, "Preset created successfully");
  } catch (error) {
    console.error("Error creating preset:", error);
    return apiResponses.internalError("Failed to create preset");
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return apiResponses.badRequest("User did not login");
    }
    const body = await request.json();
    const { id, name, pomodoroLength, shortBreakLength, longBreakLength } =
      body;

    if (!id) {
      return apiResponses.badRequest("Preset ID is required");
    }

    // 不允许修改默认预设
    if (id === "classic" || id === "short") {
      return apiResponses.forbidden();
    }

    const presetData: Prisma.TimerPresetUpdateInput = {
      name,
      pomodoroLength,
      shortBreakLength,
      longBreakLength,
    };

    const preset = await prisma.timerPreset.update({
      where: {
        id,
        userId: user.id,
      },
      data: presetData,
    });

    return successResponse(preset, "Preset updated successfully");
  } catch (error) {
    console.error("Error updating preset:", error);
    return apiResponses.internalError("Failed to update preset");
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!user) {
      return apiResponses.badRequest("User did not login");
    }

    if (!id) {
      return apiResponses.badRequest("Preset ID is required");
    }

    // 不允许删除默认预设
    if (id === "classic" || id === "short") {
      return apiResponses.forbidden();
    }

    await prisma.timerPreset.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return successResponse(null, "Preset deleted successfully");
  } catch (error) {
    console.error("Error deleting preset:", error);
    return apiResponses.internalError("Failed to delete preset");
  }
}
