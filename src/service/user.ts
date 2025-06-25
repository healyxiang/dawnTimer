import { getSession } from "next-auth/react";
import { localStorageUtils, LocalUser } from "@/lib/localStorage";
import { User } from "@prisma/client";

export type UserType = User | LocalUser | null;

{
  /**
 TODO: 这里还需要完善，如何解决判断未登录就使用localStorage中的临时用户，
 登录了使用登录用户信息。并且避免重复请求获取用户信息。
  */
}

// 简单的 session 缓存
let sessionCache: unknown = null;
let sessionCacheTime = 0;
const SESSION_CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 请求去重机制
let pendingGetSession: Promise<unknown> | null = null;

export const getUser = async (): Promise<UserType> => {
  try {
    // 1. 尝试从 next-auth session 获取用户
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

    // 2. 尝试从 localStorage 获取本地用户
    const localUser = localStorageUtils.getLocalUser();
    if (localUser) {
      return localUser;
    }

    // 3. 如果都没有，创建新的本地用户
    return localStorageUtils.createLocalUser();
  } catch (error) {
    console.error("Error getting user:", error);
    // 如果出错，返回本地用户
    return (
      localStorageUtils.getLocalUser() || localStorageUtils.createLocalUser()
    );
  }
};

// 清除 session 缓存
export const clearSessionCache = (): void => {
  sessionCache = null;
  sessionCacheTime = 0;
  pendingGetSession = null; // 同时清除 pending 请求
};

// 更新用户信息
export const updateUser = async (
  updates: Partial<LocalUser>
): Promise<UserType> => {
  const user = await getUser();

  if (user?.hasOwnProperty("isLocalUser")) {
    const updatedUser = { ...user, ...updates } as LocalUser;
    localStorageUtils.setLocalData("local_user", updatedUser);
    return updatedUser;
  }

  return user;
};

// 清除用户数据
export const clearUserData = async (): Promise<void> => {
  const user = await getUser();

  if (user?.hasOwnProperty("isLocalUser")) {
    localStorageUtils.clearAllLocalData();
  }

  // 清除 session 缓存
  clearSessionCache();
};
