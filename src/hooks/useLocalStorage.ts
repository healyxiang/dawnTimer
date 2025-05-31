import { useEffect, useState } from "react";
import { localStorageUtils, LocalUser } from "@/lib/localStorage";
// import { User } from "@prisma/client";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初始化状态
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    return localStorageUtils.getLocalData<T>(key) ?? initialValue;
  });

  // 当值改变时更新 localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorageUtils.setLocalData(key, storedValue);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export function useLocalUser() {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    // 获取本地用户
    const localUser = localStorageUtils.getLocalUser();
    if (localUser) {
      setUser(localUser);
    } else {
      // 如果没有本地用户，创建一个新的
      const newLocalUser = localStorageUtils.createLocalUser();
      setUser(newLocalUser);
    }
  }, []);

  const updateLocalUser = (data: Partial<LocalUser>) => {
    const currentUser = localStorageUtils.getLocalUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      localStorageUtils.setLocalData("local_user", updatedUser);
      setUser(updatedUser);
    }
  };

  const clearLocalUser = () => {
    localStorageUtils.clearAllLocalData();
    setUser(null);
  };

  return {
    user,
    updateLocalUser,
    clearLocalUser,
    isLocalUser: user?.hasOwnProperty("isLocalUser"),
  };
}
