import { getSession } from "next-auth/react";
import { localStorageUtils, LocalUser } from "@/lib/localStorage";
import { User } from "@prisma/client";

export type UserType = User | LocalUser | null;

export const getUser = async (): Promise<UserType> => {
  try {
    // 1. 尝试从 next-auth session 获取用户
    const session = await getSession();
    if (session?.user) {
      return session.user as User;
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
};
