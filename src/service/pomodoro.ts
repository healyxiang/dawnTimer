// 客户端 api请求
import {
  Task,
  Skill,
  TimerRecord,
  TimerSettings,
  TimerPreset,
  TimerPresetWithoutNameAndCreatedAt,
} from "@/types/pomodoro";
import { BaseModel } from "@/types/common";
import { DEFAULT_PRESETS } from "@/constants/pomodoro";
import { localStorageUtils } from "@/lib/localStorage";
import { getUser } from "./user";

// 通用的数据获取函数
const fetchData = async <T extends BaseModel>(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>
): Promise<T[]> => {
  const user = await getUser();
  const isLocalUser = user?.hasOwnProperty("isLocalUser");

  // 如果是本地用户，从 localStorage 获取数据
  if (isLocalUser) {
    const localData = localStorageUtils.getLocalData<T[]>(endpoint);
    return localData || [];
  }

  // 如果是登录用户，从 API 获取数据
  try {
    const response = await fetch(`/api/pomodoro/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

// 通用的数据保存函数
const saveData = async <T extends BaseModel>(
  endpoint: string,
  data: Partial<T>,
  method: string = "POST"
): Promise<T | null> => {
  const user = await getUser();
  const isLocalUser = user?.hasOwnProperty("isLocalUser");

  // 如果是本地用户，保存到 localStorage
  if (isLocalUser) {
    // 获取现有数据
    const existingData = localStorageUtils.getLocalData<T[]>(endpoint) || [];

    if (method === "POST") {
      // 添加新数据
      const newItem = {
        ...data,
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as T;
      const newData = [...existingData, newItem];
      localStorageUtils.setLocalData(endpoint, newData);
      return newItem;
    } else if (method === "PUT" && data.id) {
      // 更新现有数据
      const updatedData = existingData.map((item) =>
        item.id === data.id
          ? {
              ...item,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      localStorageUtils.setLocalData(endpoint, updatedData);
      return updatedData.find((item) => item.id === data.id) || null;
    }
    return null;
  }

  // 如果是登录用户，保存到 API
  try {
    const response = await fetch(`/api/pomodoro/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error(`Error saving ${endpoint}:`, error);
    return null;
  }
};

// Timer Records
export const getTimerRecords = async (): Promise<TimerRecord[]> => {
  return fetchData<TimerRecord>("records");
};

export const addTimerRecord = async (
  record: Omit<TimerRecord, "id" | "createdAt" | "updatedAt">
): Promise<void> => {
  await saveData<TimerRecord>("records", record);
};

export const clearTimerRecords = async (): Promise<void> => {
  const user = await getUser();
  const isLocalUser = user?.hasOwnProperty("isLocalUser");

  if (isLocalUser) {
    localStorageUtils.clearLocalData("records");
    return;
  }

  try {
    const response = await fetch("/api/pomodoro/records", {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error clearing timer records:", error);
    throw error;
  }
};

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  return fetchData<Task>("tasks");
};

export const addTask = async (
  task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
): Promise<Task> => {
  const result = await saveData<Task>("tasks", task);
  if (!result) {
    throw new Error("Failed to add task");
  }
  return result;
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> => {
  return saveData<Task>("tasks", { id: taskId, ...updates }, "PUT");
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const user = await getUser();
  const isLocalUser = user?.hasOwnProperty("isLocalUser");

  if (isLocalUser) {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    localStorageUtils.setLocalData("tasks", updatedTasks);
    return;
  }

  try {
    const response = await fetch(`/api/pomodoro/tasks?id=${taskId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  return fetchData<Skill>("skills");
};

export const addSkill = async (
  skill: Omit<Skill, "id" | "createdAt" | "updatedAt">
): Promise<Skill> => {
  const result = await saveData<Skill>("skills", skill);
  if (!result) {
    throw new Error("Failed to add skill");
  }
  return result;
};

export const updateSkill = async (
  skillId: string,
  updates: Partial<Skill>
): Promise<Skill | null> => {
  return saveData<Skill>("skills", { id: skillId, ...updates }, "PUT");
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  const user = await getUser();
  const isLocalUser = user?.hasOwnProperty("isLocalUser");

  if (isLocalUser) {
    const skills = await getSkills();
    const updatedSkills = skills.filter((skill) => skill.id !== skillId);
    localStorageUtils.setLocalData("skills", updatedSkills);
    return;
  }

  try {
    const response = await fetch(`/api/pomodoro/skills?id=${skillId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};

// Timer Settings
export const getTimerSettings = async (): Promise<TimerPreset> => {
  const user = await getUser();
  const isLocalUser = user?.hasOwnProperty("isLocalUser");

  if (isLocalUser) {
    const localSettings =
      localStorageUtils.getLocalData<TimerPreset>("settings");
    if (localSettings) {
      return localSettings;
    }
    return DEFAULT_PRESETS[0];
  }

  try {
    const response = await fetch("/api/pomodoro/presets");
    const result = await response.json();
    if (result.code === 200) {
      const presets = result.data;
      const lastPresetId = await getLastPresetId();
      const currentPreset =
        presets.find((p: TimerPreset) => p.id === lastPresetId) || presets[0];
      return {
        ...currentPreset,
        pomodoroLength: currentPreset.pomodoroLength,
        shortBreakLength: currentPreset.shortBreakLength,
        longBreakLength: currentPreset.longBreakLength,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        longBreakInterval: 4,
      };
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error fetching timer settings:", error);
    return DEFAULT_PRESETS[0];
  }
};

export const updateTimerSettings = async (
  settings: TimerSettings
): Promise<void> => {
  try {
    const lastPresetId = await getLastPresetId();
    const response = await fetch("/api/pomodoro/presets", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: lastPresetId,
        pomodoroLength: settings.pomodoroLength,
        shortBreakLength: settings.shortBreakLength,
        longBreakLength: settings.longBreakLength,
      }),
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error updating timer settings:", error);
    throw error;
  }
};

// Timer Presets
export const getTimerPresets = async (): Promise<TimerPreset[]> => {
  try {
    const response = await fetch("/api/pomodoro/presets");
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error fetching timer presets:", error);
    return DEFAULT_PRESETS;
  }
};

export const addTimerPreset = async (
  preset: Omit<TimerPreset, "createdAt" | "updatedAt">
): Promise<TimerPreset> => {
  try {
    const response = await fetch("/api/pomodoro/presets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: preset.name,
        pomodoroLength: preset.pomodoroLength,
        shortBreakLength: preset.shortBreakLength,
        longBreakLength: preset.longBreakLength,
        longBreakInterval: preset.longBreakInterval,
        autoStartBreaks: preset.autoStartBreaks || false,
        autoStartPomodoros: preset.autoStartPomodoros || false,
      }),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error adding timer preset:", error);
    throw error;
  }
};

export const deleteTimerPreset = async (presetId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/pomodoro/presets?id=${presetId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error deleting timer preset:", error);
    throw error;
  }
};

// 获取和设置最后使用的预设ID
export const getLastPresetId = async (): Promise<string> => {
  try {
    const response = await fetch("/api/pomodoro/presets");
    const result = await response.json();
    if (result.code === 200) {
      const presets = result.data;
      const lastPreset = presets[0]; // 获取最新的预设
      return lastPreset?.id || "classic";
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error getting last preset ID:", error);
    return "classic";
  }
};

export const setLastPresetId = async (presetId: string): Promise<void> => {
  try {
    const response = await fetch("/api/pomodoro/presets", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: presetId,
        isLastUsed: true,
      }),
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error setting last preset ID:", error);
    throw error;
  }
};

// 修改 updateTimerPreset 函数
export const updateTimerPreset = async (
  preset: Omit<TimerPreset, "createdAt" | "updatedAt">
): Promise<TimerPreset | null> => {
  try {
    const user = await getUser();
    const isLocalUser = user?.hasOwnProperty("isLocalUser");

    if (isLocalUser) {
      const newPreset: TimerPreset = {
        ...preset,
        id: preset?.id || "classic",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localStorageUtils.setLocalData("settings", newPreset);
      return newPreset;
    }

    const presetId = preset.id;
    const response = await fetch("/api/pomodoro/presets", {
      method: presetId ? "PUT" : "POST", // 如果presetId存在，则更新，否则创建
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: presetId,
        name: preset.name || "First Preset",
        pomodoroLength: preset.pomodoroLength,
        shortBreakLength: preset.shortBreakLength,
        longBreakLength: preset.longBreakLength,
        longBreakInterval: preset.longBreakInterval,
      }),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error updating timer preset:", error);
    return null;
  }
};

// 更新预设并设置为当前预设
export const updateCurrentPreset = async (
  newPreset: TimerPresetWithoutNameAndCreatedAt
): Promise<TimerPreset | null> => {
  try {
    const response = await fetch("/api/pomodoro/presets", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: newPreset.id,
        pomodoroLength: newPreset.pomodoroLength,
        shortBreakLength: newPreset.shortBreakLength,
        longBreakLength: newPreset.longBreakLength,
        longBreakInterval: newPreset.longBreakInterval,
        autoStartBreaks: newPreset.autoStartBreaks || false,
        autoStartPomodoros: newPreset.autoStartPomodoros || false,
        isLastUsed: true,
      }),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error updating current preset:", error);
    return null;
  }
};

// Batch operations
export const clearAllData = async (): Promise<void> => {
  try {
    await Promise.all([
      clearTimerRecords(),
      // 删除所有任务
      fetch("/api/pomodoro/tasks", { method: "DELETE" }),
      // 删除所有技能
      fetch("/api/pomodoro/skills", { method: "DELETE" }),
      // 重置预设
      fetch("/api/pomodoro/presets", { method: "DELETE" }),
    ]);
  } catch (error) {
    console.error("Error clearing all data:", error);
    throw error;
  }
};
