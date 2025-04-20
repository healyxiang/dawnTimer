import {
  Task,
  Skill,
  TimerRecord,
  TimerSettings,
  TimerPreset,
  TimerPresetWithoutNameAndCreatedAt,
} from "@/types/pomodoro";

// LocalStorage keys
const TASKS_KEY = "pomodoro_tasks";
const SKILLS_KEY = "pomodoro_skills";
const TIMER_RECORDS_KEY = "pomodoro_timer_records";
const TIMER_SETTINGS_KEY = "pomodoro_timer_settings";
const TIMER_PRESETS_KEY = "timerPresets";
const LAST_PRESET_ID_KEY = "lastPresetId";

// Default timer settings
export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  pomodoroLength: 25 * 60, // 25 minutes
  shortBreakLength: 5 * 60, // 5 minutes
  longBreakLength: 15 * 60, // 15 minutes
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4, // long break after 4 pomodoros
};

// 添加默认预设
export const DEFAULT_PRESETS: TimerPreset[] = [
  {
    id: "classic",
    name: "Classic Pomodoro",
    settings: {
      pomodoroLength: 25 * 60,
      shortBreakLength: 5 * 60,
      longBreakLength: 15 * 60,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      longBreakInterval: 4,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "short",
    name: "Short Sessions",
    settings: {
      pomodoroLength: 15 * 60,
      shortBreakLength: 3 * 60,
      longBreakLength: 10 * 60,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      longBreakInterval: 4,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper function to safely parse JSON from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to safely save to localStorage
const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Timer Records
export const getTimerRecords = async (): Promise<TimerRecord[]> => {
  return getFromStorage<TimerRecord[]>(TIMER_RECORDS_KEY, []);
};

export const addTimerRecord = async (record: TimerRecord): Promise<void> => {
  const records = await getTimerRecords();
  records.push(record);
  saveToStorage(TIMER_RECORDS_KEY, records);
};

export const clearTimerRecords = async (): Promise<void> => {
  saveToStorage(TIMER_RECORDS_KEY, []);
};

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  return getFromStorage<Task[]>(TASKS_KEY, []);
};

export const addTask = async (
  task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
): Promise<Task> => {
  const tasks = await getTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    ...task,
    pomodoroRatings: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  saveToStorage(TASKS_KEY, tasks);
  return newTask;
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> => {
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return null;

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };
  tasks[taskIndex] = updatedTask;
  saveToStorage(TASKS_KEY, tasks);
  return updatedTask;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter((t) => t.id !== taskId);
  saveToStorage(TASKS_KEY, filteredTasks);
};

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  return getFromStorage<Skill[]>(SKILLS_KEY, []);
};

export const addSkill = async (
  skill: Omit<Skill, "id" | "createdAt" | "updatedAt">
): Promise<Skill> => {
  const skills = await getSkills();
  const newSkill: Skill = {
    id: Date.now().toString(),
    ...skill,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  skills.push(newSkill);
  saveToStorage(SKILLS_KEY, skills);
  return newSkill;
};

export const updateSkill = async (
  skillId: string,
  updates: Partial<Skill>
): Promise<Skill | null> => {
  const skills = await getSkills();
  const skillIndex = skills.findIndex((s) => s.id === skillId);
  if (skillIndex === -1) return null;

  const updatedSkill = {
    ...skills[skillIndex],
    ...updates,
    updatedAt: new Date(),
  };
  skills[skillIndex] = updatedSkill;
  saveToStorage(SKILLS_KEY, skills);
  return updatedSkill;
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  const skills = await getSkills();
  const filteredSkills = skills.filter((s) => s.id !== skillId);
  saveToStorage(SKILLS_KEY, filteredSkills);
};

// Timer Settings
export const getTimerSettings = async (): Promise<TimerSettings> => {
  return getFromStorage<TimerSettings>(
    TIMER_SETTINGS_KEY,
    DEFAULT_TIMER_SETTINGS
  );
};

export const updateTimerSettings = async (
  settings: TimerSettings
): Promise<void> => {
  saveToStorage(TIMER_SETTINGS_KEY, settings);
};

// Timer Presets
export const getTimerPresets = async (): Promise<TimerPreset[]> => {
  return getFromStorage<TimerPreset[]>(TIMER_PRESETS_KEY, DEFAULT_PRESETS);
};

export const addTimerPreset = async (
  preset: Omit<TimerPreset, "createdAt" | "updatedAt">
): Promise<TimerPreset> => {
  const presets = await getTimerPresets();
  const newPreset: TimerPreset = {
    ...preset,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedPresets = [...presets, newPreset];
  saveToStorage(TIMER_PRESETS_KEY, updatedPresets);
  return newPreset;
};

export const deleteTimerPreset = async (presetId: string): Promise<void> => {
  if (presetId === "classic" || presetId === "short") {
    throw new Error("Cannot delete default presets");
  }

  const presets = await getTimerPresets();
  const updatedPresets = presets.filter((p) => p.id !== presetId);
  saveToStorage(TIMER_PRESETS_KEY, updatedPresets);
};

// 获取和设置最后使用的预设ID
export const getLastPresetId = async (): Promise<string> => {
  return getFromStorage<string>(LAST_PRESET_ID_KEY, "classic");
};

export const setLastPresetId = async (presetId: string): Promise<void> => {
  saveToStorage(LAST_PRESET_ID_KEY, presetId);
};

// 修改 updateTimerPreset 函数
export const updateTimerPreset = async (
  presetId: string,
  settings: TimerSettings
): Promise<TimerPreset | null> => {
  const presets = await getTimerPresets();
  const presetIndex = presets.findIndex((p) => p.id === presetId);

  if (presetIndex === -1) return null;

  const updatedPreset: TimerPreset = {
    ...presets[presetIndex],
    settings,
    updatedAt: new Date(),
  };

  presets[presetIndex] = updatedPreset;
  saveToStorage(TIMER_PRESETS_KEY, presets);
  return updatedPreset;
};

// 更新预设并设置为当前预设
export const updateCurrentPreset = async (
  newPreset: TimerPresetWithoutNameAndCreatedAt
): Promise<TimerPreset | null> => {
  const presets = await getTimerPresets();
  let updatedPreset = null as TimerPreset | null;
  const updatedPresets = presets.map((p) => {
    if (p.id === newPreset.id) {
      updatedPreset = { ...p, ...newPreset };
      return updatedPreset;
    }
    return p;
  });

  await Promise.all([
    saveToStorage(TIMER_PRESETS_KEY, updatedPresets),
    setLastPresetId(newPreset.id),
  ]);
  return updatedPreset;
};

// Batch operations
export const clearAllData = async (): Promise<void> => {
  await Promise.all([
    clearTimerRecords(),
    saveToStorage(TASKS_KEY, []),
    saveToStorage(SKILLS_KEY, []),
    saveToStorage(TIMER_SETTINGS_KEY, DEFAULT_TIMER_SETTINGS),
  ]);
};
