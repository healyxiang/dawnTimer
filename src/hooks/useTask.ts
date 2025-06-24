import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Task, Skill } from "@/types/pomodoro";
import { getTasks, addTask, updateTask, deleteTask } from "@/service/pomodoro";
import { useCurrentTaskStore } from "@/store/currentTask";

interface UseTaskOptions {
  initialTasks?: Task[];
  skills?: Skill[];
  autoFetch?: boolean;
}

interface UseTaskReturn {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // CRUD Operations
  addTask: (
    task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;

  // Utility
  getTaskById: (taskId: string) => Task | undefined;
  refreshTasks: () => Promise<void>;
}

/**
 * 通用的任务管理 Hook
 *
 * 提供完整的任务 CRUD 操作，支持 API 调用
 *
 * @param options - Hook 配置选项
 * @param options.initialTasks - 初始任务列表
 * @param options.autoFetch - 是否自动从 API 获取任务（默认 true）
 *
 * @returns 任务管理相关的状态和方法
 *
 * @example
 * ```tsx
 * // 基本使用（带 API 调用）
 * const { tasks, addTask, updateTask, deleteTask, isLoading } = useTask();
 *
 * // 添加任务
 * await addTask({
 *   title: "新任务",
 *   description: "任务描述",
 *   quadrant: "q1",
 *   skillIds: ["1", "2"]
 * });
 *
 * // 更新任务
 * await updateTask("task-id", { completed: true });
 *
 * // 删除任务
 * await deleteTask("task-id");
 * ```
 */
export default function useTask(options: UseTaskOptions = {}): UseTaskReturn {
  const { initialTasks = [], autoFetch = true } = options;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentTask, setCurrentTask } = useCurrentTaskStore();

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    if (!autoFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(errorMessage);
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, [autoFetch]);

  // Initialize tasks
  useEffect(() => {
    if (initialTasks.length === 0) {
      fetchTasks();
    }
  }, [initialTasks.length, fetchTasks]);

  // Add task with API call
  const addTaskWithAPI = useCallback(
    async (
      task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const newTask = await addTask(task);
        setTasks((prev) => [...prev, newTask]);
        toast.success("Task added successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add task";
        setError(errorMessage);
        toast.error("Failed to add task");
        console.error("Error adding task:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update task with API call
  const updateTaskWithAPI = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedTask = await updateTask(taskId, updates);
        if (updatedTask) {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? updatedTask : t))
          );

          // Update current task if it's the one being updated
          if (currentTask?.id === taskId) {
            setCurrentTask(updatedTask);
          }
        }
        toast.success("Task updated successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update task";
        setError(errorMessage);
        toast.error("Failed to update task");
        console.error("Error updating task:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentTask?.id, setCurrentTask]
  );

  // Delete task with API call
  const deleteTaskWithAPI = useCallback(
    async (taskId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteTask(taskId);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));

        // Clear current task if it's the one being deleted
        if (currentTask?.id === taskId) {
          setCurrentTask(undefined);
        }

        toast.success("Task deleted successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete task";
        setError(errorMessage);
        toast.error("Failed to delete task");
        console.error("Error deleting task:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentTask?.id, setCurrentTask]
  );

  // Complete task (toggle completion status)
  const completeTask = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await updateTaskWithAPI(taskId, { completed: !task.completed });
      }
    },
    [tasks, updateTaskWithAPI]
  );

  // Utility functions
  const getTaskById = useCallback(
    (taskId: string) => {
      return tasks.find((task) => task.id === taskId);
    },
    [tasks]
  );

  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  return {
    // State
    tasks,
    isLoading,
    error,

    // CRUD Operations with API
    addTask: addTaskWithAPI,
    updateTask: updateTaskWithAPI,
    deleteTask: deleteTaskWithAPI,
    completeTask,

    // Utility
    getTaskById,
    refreshTasks,
  };
}
