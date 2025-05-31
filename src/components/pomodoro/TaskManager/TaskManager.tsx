"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, Skill } from "@/types/pomodoro";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTasks } from "@/service/pomodoro";
import { TaskDialog } from "./TaskDialog";
import { addTask, updateTask, deleteTask } from "@/service/pomodoro";
import { useCurrentTaskStore } from "@/store/currentTask";

interface TaskManagerProps {
  tasks: Task[];
  skills: Skill[];
}

export function TaskManager({ tasks: initialTasks, skills }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<string>("all");
  const { currentTask, setCurrentTask } = useCurrentTaskStore();

  const handleAddTask = async (
    task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newTask = await addTask(task);
      setTasks((prev) => [...prev, newTask]);
      toast.success("Task added successfully");
    } catch (error) {
      toast.error("Failed to add task");
      console.error("Error adding task:", error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const updatedTask = await updateTask(taskId, {
          completed: !task.completed,
        });
        if (updatedTask) {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? updatedTask : t))
          );
          if (currentTask?.id === taskId && updatedTask.completed) {
            setCurrentTask(undefined);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      if (currentTask?.id === taskId) {
        setCurrentTask(undefined);
      }
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setCurrentTask(task);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (selectedTaskType === "all") return true;
    return task.completed === (selectedTaskType === "completed");
  });

  useEffect(() => {
    if (initialTasks.length === 0) {
      // 服务端没有数据，前端从接口获取，未登录用户使用本地数据
      const fetchTasks = async () => {
        const tasks = await getTasks();
        setTasks(tasks);
      };
      fetchTasks();
    }
  }, [initialTasks.length]);

  return (
    <Card className="p-4 space-y-4 bg-card/50">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={selectedTaskType === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTaskType("all")}
          >
            All
          </Button>
          <Button
            variant={selectedTaskType === "active" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTaskType("active")}
          >
            Active
          </Button>
          <Button
            variant={selectedTaskType === "completed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTaskType("completed")}
          >
            Completed
          </Button>
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-1">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "group flex items-center gap-3 px-2 py-1 rounded-lg transition-colors",
              "hover:bg-muted/50",
              currentTask?.id === task.id && "bg-muted"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-5 w-5 rounded-full",
                task.completed ? "bg-primary text-primary-foreground" : "border"
              )}
              onClick={() => handleCompleteTask(task.id)}
            >
              {task.completed && <Check className="h-4 w-4" />}
            </Button>

            <div
              className="flex-1 cursor-pointer"
              onClick={() => handleTaskSelect(task.id)}
            >
              <div
                className={cn(
                  "font-medium",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </div>
              {task.skills && task.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {task.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="text-xs"
                      style={{ backgroundColor: skill.color || "gray" }}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddTask}
        skills={skills}
      />
    </Card>
  );
}
