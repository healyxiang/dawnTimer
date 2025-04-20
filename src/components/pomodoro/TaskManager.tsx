"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, Skill } from "@/types/pomodoro";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

import { TaskDialog } from "./TaskDialog";
import { cn } from "@/lib/utils";

interface TaskManagerProps {
  tasks: Task[];
  skills: Skill[];
  onAddTask: (
    task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
  ) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskSelect: (task: Task) => void;
}

const TaskFilter = ({
  onTaskTypeSelect,
}: {
  onTaskTypeSelect: (taskType: string) => void;
}) => {
  return (
    <div>
      <Select onValueChange={onTaskTypeSelect}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Filter by task" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="incomplete">Incomplete</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export function TaskManager({
  tasks,
  skills,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
  onTaskSelect,
}: TaskManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTaskType, setSelectedTaskType] = useState<string>("all");
  //   const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      onTaskSelect(task);
    }
  };

  const handleTaskTypeSelect = (taskType: string) => {
    setSelectedTaskType(taskType);
  };

  const filteredTasks = tasks.filter((task) => {
    if (selectedTaskType === "all") return true;
    return task.completed === (selectedTaskType === "completed");
  });

  return (
    <Card className="p-4 space-y-2 bg-card/50">
      <div className="flex gap-4 items-center">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <TaskFilter onTaskTypeSelect={handleTaskTypeSelect} />
        <Button className="ml-auto" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card
            className={cn("p-3 bg-background/50", {
              //   "border-primary": selectedTaskId === task.id,
              "bg-green-300": selectedTaskId === task.id,
              "dark:bg-green-900": selectedTaskId === task.id,
            })}
            key={task.id}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{task.title}</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTaskSelect(task.id)}
                  >
                    Select
                  </Button>
                  <Button
                    variant={task.completed ? "secondary" : "default"}
                    size="sm"
                    onClick={() => onCompleteTask(task.id)}
                  >
                    {task.completed ? "Completed" : "Complete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {task.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {task.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      style={{ backgroundColor: skill.color }}
                      className="text-xs px-2 py-0.5"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={onAddTask}
        skills={skills}
      />
    </Card>
  );
}
