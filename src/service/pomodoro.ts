import {
  Task,
  Skill,
  TimerRecord,
  TimerSettings,
  TimerPreset,
  TimerPresetWithoutNameAndCreatedAt,
} from "@/types/pomodoro";

import { DEFAULT_TIMER_SETTINGS, DEFAULT_PRESETS } from "@/constants/pomodoro";

// Timer Records
export const getTimerRecords = async (): Promise<TimerRecord[]> => {
  try {
    const response = await fetch("/api/pomodoro/records");
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error fetching timer records:", error);
    return [];
  }
};

export const addTimerRecord = async (record: TimerRecord): Promise<void> => {
  try {
    // localStorage.setItem(key, JSON.stringify(value));
    const response = await fetch("/api/pomodoro/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });
    const result = await response.json();
    if (result.code !== 200) {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error adding timer record:", error);
    throw error;
  }
};

export const clearTimerRecords = async (): Promise<void> => {
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
  try {
    const response = await fetch("/api/pomodoro/tasks");
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const addTask = async (
  task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
): Promise<Task> => {
  try {
    const response = await fetch("/api/pomodoro/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> => {
  try {
    const response = await fetch("/api/pomodoro/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: taskId, ...updates }),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
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
  try {
    const response = await fetch("/api/pomodoro/skills");
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};

export const addSkill = async (
  skill: Omit<Skill, "id" | "createdAt" | "updatedAt">
): Promise<Skill> => {
  try {
    const response = await fetch("/api/pomodoro/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skill),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error adding skill:", error);
    throw error;
  }
};

export const updateSkill = async (
  skillId: string,
  updates: Partial<Skill>
): Promise<Skill | null> => {
  try {
    const response = await fetch("/api/pomodoro/skills", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: skillId, ...updates }),
    });
    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    }
    throw new Error(result.message);
  } catch (error) {
    console.error("Error updating skill:", error);
    return null;
  }
};

export const deleteSkill = async (skillId: string): Promise<void> => {
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
export const getTimerSettings = async (): Promise<TimerSettings> => {
  try {
    const response = await fetch("/api/pomodoro/presets");
    const result = await response.json();
    if (result.code === 200) {
      const presets = result.data;
      const lastPresetId = await getLastPresetId();
      const currentPreset =
        presets.find((p: TimerPreset) => p.id === lastPresetId) || presets[0];
      return {
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
    return DEFAULT_TIMER_SETTINGS;
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
