import { getCurrentUser } from "@/app/api/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, apiResponses } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const skills = await prisma.skill.findMany({
      where: { userId: user.id, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    return successResponse(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return apiResponses.unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { name, description, color } = body;

    if (!name) {
      return apiResponses.badRequest("Name is required");
    }

    const skillData: Prisma.SkillCreateInput = {
      name,
      description,
      color,
      user: { connect: { id: user.id } },
    };

    const skill = await prisma.skill.create({
      data: skillData,
    });

    return successResponse(skill, "Skill created successfully");
  } catch (error) {
    console.error("Error creating skill:", error);
    return apiResponses.internalError("Failed to create skill");
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { id, name, description } = body;

    if (!id) {
      return apiResponses.badRequest("Skill ID is required");
    }

    const skillData: Prisma.SkillUpdateInput = {
      name,
      description,
    };

    const skill = await prisma.skill.update({
      where: {
        id,
        userId: user.id,
      },
      data: skillData,
    });

    return successResponse(skill, "Skill updated successfully");
  } catch (error) {
    console.error("Error updating skill:", error);
    return apiResponses.internalError("Failed to update skill");
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return apiResponses.badRequest("Skill ID is required");
    }

    await prisma.skill.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isDeleted: true,
      },
    });

    return successResponse(null, "Skill deleted successfully");
  } catch (error) {
    console.error("Error deleting skill:", error);
    return apiResponses.internalError("Failed to delete skill");
  }
}
