// 服务端 db 操作，供服务端使用
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/app/api/lib/auth";

export async function getSkills() {
  const user = await getCurrentUser();
  return prisma.skill.findMany({
    where: { userId: user.id, isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSkill(data: {
  name: string;
  description?: string;
  color: string;
}) {
  const user = await getCurrentUser();
  const skillData: Prisma.SkillCreateInput = {
    name: data.name,
    description: data.description,
    color: data.color,
    user: { connect: { id: user.id } },
  };

  return prisma.skill.create({
    data: skillData,
  });
}

export async function updateSkill(data: {
  id: string;
  name?: string;
  description?: string;
}) {
  const user = await getCurrentUser();
  const skillData: Prisma.SkillUpdateInput = {
    name: data.name,
    description: data.description,
  };

  return prisma.skill.update({
    where: {
      id: data.id,
      userId: user.id,
    },
    data: skillData,
  });
}

export async function deleteSkill(id: string) {
  const user = await getCurrentUser();
  return prisma.skill.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      isDeleted: true,
    },
  });
}
