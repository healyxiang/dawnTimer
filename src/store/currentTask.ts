import { create } from "zustand";
import { Task } from "@/types/pomodoro";

interface CurrentTaskState {
  currentTask: Task | undefined;
  setCurrentTask: (task: Task | undefined) => void;
}

export const useCurrentTaskStore = create<CurrentTaskState>((set) => ({
  currentTask: undefined,
  setCurrentTask: (task) => set({ currentTask: task }),
}));
