export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface PomodoroRating {
  focus: Rating;
  completion: Rating;
  satisfaction: Rating;
  timestamp: Date;
  taskId?: string;
}

export interface Skill {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  skillIds?: string[];
  skills?: Skill[];
  completed: boolean;
  pomodoroRatings: PomodoroRating[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimerPreset {
  id: string;
  name: string;
  pomodoroLength: number; // 秒
  shortBreakLength: number; // 秒
  longBreakLength: number; // 秒
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  settings?: TimerSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type TimerPresetWithoutNameAndCreatedAt = Omit<
  TimerPreset,
  "name" | "createdAt"
>;

export interface TimerSettings {
  pomodoroLength: number; // 秒
  shortBreakLength: number; // 秒
  longBreakLength: number; // 秒
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}

export interface PomodoroSession {
  id: string;
  mode: TimerMode;
  startTime: Date;
  endTime?: Date;
  taskId?: string;
  rating?: PomodoroRating;
}

export interface PomodoroStats {
  totalPomodoros: number;
  averageRatings: {
    focus: number;
    completion: number;
    satisfaction: number;
  };
  skillDistribution: {
    skillId: string;
    count: number;
  }[];
  dailyPomodoros: {
    date: string;
    count: number;
  }[];
}

export interface TimerRecord {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  round: number;
  type: "pomodoro" | "shortBreak" | "longBreak";
  taskId?: string;
  taskName?: string;
  skillIds?: string[];
  skills?: Skill[];
}
