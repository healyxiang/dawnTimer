import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
  // eslint-disable-next-line no-var
  var prismaDisconnectListenerRegistered: boolean | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = createPrismaClient();
  }
  prisma = global.cachedPrisma;
}

// 优雅关闭连接（确保只注册一次监听器，避免 HMR 重复注册）
if (
  typeof window === "undefined" &&
  !global.prismaDisconnectListenerRegistered
) {
  global.prismaDisconnectListenerRegistered = true;
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
