"use client";

import { useState, useEffect } from "react";
import { Timer } from "@/components/pomodoro/Timer";
import { RatingDialog } from "@/components/pomodoro/RatingDialog";
import { TaskManager } from "@/components/pomodoro/TaskManager";
import { SkillManager } from "@/components/pomodoro/SkillManager";
import { StatsManager } from "@/components/pomodoro/StatsManager";
import {
  Task,
  Skill,
  PomodoroRating,
  Rating,
  TimerRecord,
  TimerPreset,
} from "@/types/pomodoro";
import { toast } from "sonner";
import {
  getTimerPresets,
  getLastPresetId,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getSkills,
  addSkill,
  deleteSkill,
  getTimerRecords,
  addTimerRecord,
  updateCurrentPreset,
} from "@/service/pomodoro";
import { cn } from "@/lib/utils";
import { DEFAULT_PRESETS } from "@/service/pomodoro";

export default function PomodoroApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [timerRecords, setTimerRecords] = useState<TimerRecord[]>([]);
  const [currentPreset, setCurrentPreset] = useState<TimerPreset>(
    DEFAULT_PRESETS[0]
  );

  // Initialize data from localStorage
  useEffect(() => {
    const initializeData = async () => {
      const [presets, lastPresetId, tasksData, skillsData, records] =
        await Promise.all([
          getTimerPresets(),
          getLastPresetId(),
          getTasks(),
          getSkills(),
          getTimerRecords(),
        ]);

      const preset = presets.find((p) => p.id === lastPresetId) || presets[0];
      setCurrentPreset(preset);
      setTasks(tasksData);
      setSkills(skillsData);
      setTimerRecords(records);
    };
    initializeData();
  }, []);

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

  const handleAddSkill = async (
    skill: Omit<Skill, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newSkill = await addSkill(skill);
      setSkills((prev) => [...prev, newSkill]);
      toast.success("Skill added successfully");
    } catch (error) {
      toast.error("Failed to add skill");
      console.error("Error adding skill:", error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await deleteSkill(skillId);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          skills: task.skills.filter((skill) => skill.id !== skillId),
        }))
      );
      toast.success("Skill deleted successfully");
    } catch (error) {
      toast.error("Failed to delete skill");
      console.error("Error deleting skill:", error);
    }
  };

  const handlePomodoroComplete = async () => {
    // TODO: 后续打开评分弹窗
    // setIsRatingDialogOpen(true);
    if (currentTask) {
      try {
        const updatedTask = await updateTask(currentTask.id, {
          pomodoroRatings: [...currentTask.pomodoroRatings],
        });

        if (updatedTask) {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === currentTask.id ? updatedTask : task
            )
          );
          toast.success("Session rated successfully");
        }
      } catch (error) {
        toast.error("Failed to save rating");
        console.error("Error saving rating:", error);
      }
    }
  };

  const handleRatingSubmit = async (ratings: {
    focus: Rating;
    completion: Rating;
    satisfaction: Rating;
  }) => {
    if (currentTask) {
      try {
        const rating: PomodoroRating = {
          ...ratings,
          timestamp: new Date(),
          taskId: currentTask.id,
        };

        const updatedTask = await updateTask(currentTask.id, {
          pomodoroRatings: [...currentTask.pomodoroRatings, rating],
        });

        if (updatedTask) {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === currentTask.id ? updatedTask : task
            )
          );
          toast.success("Session rated successfully");
        }
      } catch (error) {
        toast.error("Failed to save rating");
        console.error("Error saving rating:", error);
      }
    }
    setIsRatingDialogOpen(false);
  };

  const handleSettingsChange = async (
    newPreset: Omit<TimerPreset, "name" | "createdAt">
  ) => {
    try {
      const updatedPreset = await updateCurrentPreset(newPreset);
      if (updatedPreset) {
        setCurrentPreset(updatedPreset);
        toast.success("Timer settings updated successfully");
      }
    } catch (error) {
      console.error("Failed to update timer settings:", error);
      toast.error("Failed to update timer settings");
    }
  };

  const handleTimerComplete = async (record: TimerRecord) => {
    // if (!currentTask) {
    //   toast.error("No task selected");
    //   return;
    // }

    try {
      // 更新计时记录
      await addTimerRecord(record);
      setTimerRecords((prev) => [...prev, record]);
    } catch (error) {
      console.error("Error handling timer complete:", error);
      toast.error("Failed to save timer record");
    }
  };

  return (
    <div
      className={cn(
        "container mx-auto p-4 space-y-8 flex gap-4 items-start",
        "md:flex-col"
      )}
    >
      <div
        className={cn(
          "flex justify-center mb-8 sticky top-[93px]",
          "md:static md:w-full"
        )}
      >
        <Timer
          onComplete={handlePomodoroComplete}
          currentTask={currentTask}
          currentPreset={currentPreset}
          onSettingsChange={handleSettingsChange}
          onRecordUpdate={handleTimerComplete}
        />
      </div>

      <div className={cn("grid grid-cols-1 gap-8 grow", "md:w-full")}>
        <div className="space-y-4 border p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Task Management
          </h2>
          <TaskManager
            tasks={tasks}
            skills={skills}
            onAddTask={handleAddTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onTaskSelect={setCurrentTask}
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Skill Management
            </h2>
            <SkillManager
              skills={skills}
              onAddSkill={handleAddSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          </div>
        </div>

        <div className="mt-8">
          <StatsManager
            tasks={tasks}
            skills={skills}
            timerRecords={timerRecords}
          />
        </div>
      </div>

      <RatingDialog
        isOpen={isRatingDialogOpen}
        onClose={() => setIsRatingDialogOpen(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
