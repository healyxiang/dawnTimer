import { successResponse, apiResponses } from "@/lib/api-response";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/app/api/lib/db/skill";

export async function GET() {
  try {
    const skills = await getSkills();
    return successResponse(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return apiResponses.unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    if (!name) {
      return apiResponses.badRequest("Name is required");
    }

    const skill = await createSkill({ name, description, color });
    return successResponse(skill, "Skill created successfully");
  } catch (error) {
    console.error("Error creating skill:", error);
    return apiResponses.internalError("Failed to create skill");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description } = body;

    if (!id) {
      return apiResponses.badRequest("Skill ID is required");
    }

    const skill = await updateSkill({ id, name, description });
    return successResponse(skill, "Skill updated successfully");
  } catch (error) {
    console.error("Error updating skill:", error);
    return apiResponses.internalError("Failed to update skill");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return apiResponses.badRequest("Skill ID is required");
    }

    await deleteSkill(id);
    return successResponse(null, "Skill deleted successfully");
  } catch (error) {
    console.error("Error deleting skill:", error);
    return apiResponses.internalError("Failed to delete skill");
  }
}
