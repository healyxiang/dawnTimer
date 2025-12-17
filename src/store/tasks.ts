import { create } from "zustand";
import { Task, QuadrantType } from "@/types/pomodoro";

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByQuadrant: (quadrant: QuadrantType) => Task[];
  setIsLoading: (isLoading: boolean) => void;
  clearTasks: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  toggleTaskCompleted: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      ),
    })),

  getTaskById: (id) => get().tasks.find((task) => task.id === id),

  getTasksByQuadrant: (quadrant) =>
    get().tasks.filter((task) => task.quadrant === quadrant),

  setIsLoading: (isLoading) => set({ isLoading }),

  clearTasks: () => set({ tasks: [] }),
}));
