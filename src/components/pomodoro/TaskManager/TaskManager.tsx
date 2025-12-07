"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, Skill } from "@/types/pomodoro";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskDialog } from "./TaskDialog";
import { useCurrentTaskStore } from "@/store/currentTask";
import useTask from "@/hooks/useTask";

interface TaskManagerProps {
  tasks: Task[];
  skills: Skill[];
}

export function TaskManager({ tasks: initialTasks, skills }: TaskManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<string>("all");
  const currentTask = useCurrentTaskStore((state) => state.currentTask);
  const setCurrentTask = useCurrentTaskStore((state) => state.setCurrentTask);

  // Use the task hook for CRUD operations
  const { tasks, isLoading, error, addTask, completeTask, deleteTask } =
    useTask({
      initialTasks,
      autoFetch: initialTasks.length === 0,
    });

  const handleAddTask = async (
    task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
  ) => {
    try {
      await addTask(task);
      setIsDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error("Error in handleAddTask:", error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error("Error in handleCompleteTask:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Error in handleDeleteTask:", error);
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

      {/* Error display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

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
