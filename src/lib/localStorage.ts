// import { User } from "@prisma/client";

export interface LocalUser {
  id: string;
  name?: string | null;
  isLocalUser: true;
  createdAt: string;
  lastActive: string;
}

export const LOCAL_USER_KEY = "local_user";
export const LOCAL_DATA_KEY = "local_data";

export const localStorageUtils = {
  // 获取本地用户
  getLocalUser: (): LocalUser | null => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(LOCAL_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // 创建本地用户
  createLocalUser: (): LocalUser => {
    const now = new Date().toISOString();
    const localUser: LocalUser = {
      id: `local_${Date.now()}`,
      isLocalUser: true,
      createdAt: now,
      lastActive: now,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    return localUser;
  },

  // 获取本地数据
  getLocalData: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(`${LOCAL_DATA_KEY}_${key}`);
    return data ? JSON.parse(data) : null;
  },

  // 保存本地数据
  setLocalData: <T>(key: string, data: T): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${LOCAL_DATA_KEY}_${key}`, JSON.stringify(data));
  },

  // 清除本地数据
  clearLocalData: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`${LOCAL_DATA_KEY}_${key}`);
  },

  // 清除所有本地数据
  clearAllLocalData: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LOCAL_USER_KEY);
    // 清除所有以 LOCAL_DATA_KEY 开头的数据
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LOCAL_DATA_KEY)) {
        localStorage.removeItem(key);
      }
    });
  },

  // 更新用户最后活动时间
  updateLastActive: (): void => {
    if (typeof window === "undefined") return;
    const user = localStorageUtils.getLocalUser();
    if (user) {
      user.lastActive = new Date().toISOString();
      localStorageUtils.setLocalData(LOCAL_USER_KEY, user);
    }
  },
};
