import { getSession } from "next-auth/react";
import { User } from "@prisma/client";

export type UserType = User | null;

// 简单的 session 缓存
let sessionCache: unknown = null;
let sessionCacheTime = 0;
const SESSION_CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 请求去重机制
let pendingGetSession: Promise<unknown> | null = null;

export const getUser = async (): Promise<UserType> => {
  try {
    // 从 next-auth session 获取用户
    console.log("call getUser");

    // 检查 session 缓存
    const now = Date.now();
    if (sessionCache && now - sessionCacheTime < SESSION_CACHE_DURATION) {
      console.log("using cached session");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cachedSession = sessionCache as { user?: any };
      if (cachedSession?.user) {
        return cachedSession.user as User;
      }
    }

    // 缓存过期或不存在，重新获取
    let session: unknown;

    // 检查是否有正在进行的请求
    if (pendingGetSession) {
      console.log("waiting for existing getSession request");
      session = await pendingGetSession;
    } else {
      // 创建新的请求
      console.log("creating new getSession request");
      pendingGetSession = getSession();
      try {
        session = await pendingGetSession;
      } finally {
        // 请求完成后清除 pending 状态
        pendingGetSession = null;
      }
    }

    console.log("session:", session);

    // 缓存 session 数据
    if (session) {
      sessionCache = session;
      sessionCacheTime = now;
      console.log("cached session data");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionWithUser = session as { user?: any };
    if (sessionWithUser?.user) {
      return sessionWithUser.user as User;
    }

    // 未登录返回 null
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    // 如果出错，返回 null（必须登录）
    return null;
  }
};

// 清除 session 缓存
export const clearSessionCache = (): void => {
  sessionCache = null;
  sessionCacheTime = 0;
  pendingGetSession = null; // 同时清除 pending 请求
};

// 清除 session 缓存（用于登出等场景）
export const clearUserData = async (): Promise<void> => {
  // 清除 session 缓存
  clearSessionCache();
};
