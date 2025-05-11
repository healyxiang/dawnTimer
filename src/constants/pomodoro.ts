import { TimerSettings, TimerPreset } from "@/types/pomodoro";

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
    pomodoroLength: 25 * 60,
    shortBreakLength: 5 * 60,
    longBreakLength: 15 * 60,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
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
    pomodoroLength: 15 * 60,
    shortBreakLength: 3 * 60,
    longBreakLength: 10 * 60,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
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
