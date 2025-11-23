import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import type { User } from "@prisma/client";

// 扩展 session.user 类型，包含 id 字段
interface SessionWithId {
  user?: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

// 使用 React cache 实现请求级别的缓存
// 确保在同一个请求中，getCurrentUser 只会被调用一次
const getCurrentUserCached = cache(async (): Promise<User | null> => {
  try {
    const session = (await getServerSession(authOptions)) as SessionWithId;

    // session.user.id 来自 token.sub（在 session callback 中设置），即数据库中的 user.id
    if (!session?.user?.id || !session?.user?.email) {
      return null;
    }

    // 直接使用 session 中的用户信息，避免额外的数据库查询
    // 由于代码中只需要 user.id，可以直接从 session 中获取
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
      emailVerified: null,
      image: session.user.image ?? null,
    } as User;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
});

export async function getCurrentUser(): Promise<User | null> {
  return getCurrentUserCached();
}
