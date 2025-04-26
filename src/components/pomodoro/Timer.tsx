"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TimerMode,
  Task,
  TimerRecord,
  TimerPreset,
  TimerPresetWithoutNameAndCreatedAt,
} from "@/types/pomodoro";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimerSettings } from "./TimerSettings";
import { FOCUS_TIMER_TDK } from "@/constants/common";

interface TimerProps {
  onComplete: () => void;
  onRecordUpdate: (record: TimerRecord) => void;
  currentTask?: Task;
  currentPreset: TimerPreset;
  onSettingsChange: (settings: TimerPresetWithoutNameAndCreatedAt) => void;
}

const TimerStatus = {
  Running: "running",
  Paused: "paused",
  Stopped: "stopped",
} as const;

type TimerStatusValue = (typeof TimerStatus)[keyof typeof TimerStatus];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

function addTimerLeftToPageTitle(timeLeft: number) {
  document.title = `${formatTime(timeLeft)} - ${FOCUS_TIMER_TDK.title}`;
}

function removeTimerLeftFromPageTitle() {
  document.title =
    (FOCUS_TIMER_TDK.title as string) || "DawnLibrary Focus Timer";
}

export function Timer({
  onComplete,
  currentTask,
  currentPreset,
  onSettingsChange,
  onRecordUpdate,
}: TimerProps) {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(
    currentPreset.settings.pomodoroLength
  );
  const [status, setStatus] = useState<TimerStatusValue>(TimerStatus.Stopped);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const isRunning = status === TimerStatus.Running;
  //   const isPaused = status === TimerStatus.Paused;
  const isStopped = status === TimerStatus.Stopped;

  const getTimeForMode = useCallback(
    (mode: TimerMode) => {
      switch (mode) {
        case "pomodoro":
          return currentPreset.settings.pomodoroLength;
        case "shortBreak":
          return currentPreset.settings.shortBreakLength;
        case "longBreak":
          return currentPreset.settings.longBreakLength;
      }
    },
    [currentPreset]
  );

  useEffect(() => {
    if (isStopped) {
      setTimeLeft(getTimeForMode(mode));
      removeTimerLeftFromPageTitle();
    }
  }, [currentPreset.settings.pomodoroLength, isStopped, getTimeForMode, mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      if (!startTime) {
        setStartTime(new Date());
      }
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        addTimerLeftToPageTitle(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setStatus(TimerStatus.Stopped);

      // 记录计时器完成
      if (startTime) {
        const endTime = new Date();
        const duration = Math.round(
          (endTime.getTime() - startTime.getTime()) / 60000
        ); // 转换为分钟

        const record: TimerRecord = {
          id: Date.now().toString(),
          startTime: startTime.toISOString(),
          duration,
          type:
            mode === "pomodoro"
              ? "focus"
              : mode === "shortBreak"
              ? "shortBreak"
              : "longBreak",
          taskName: currentTask?.title,
          skillIds: currentTask?.skills.map((skill) => skill.id),
        };

        onRecordUpdate(record);
        setStartTime(null);
      }

      if (mode === "pomodoro") {
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);

        // Determine next break type
        if (newCount % currentPreset.settings.longBreakInterval === 0) {
          setMode("longBreak");
          setTimeLeft(currentPreset.settings.longBreakLength);
          addTimerLeftToPageTitle(currentPreset.settings.longBreakLength);
        } else {
          setMode("shortBreak");
          setTimeLeft(currentPreset.settings.shortBreakLength);
          addTimerLeftToPageTitle(currentPreset.settings.shortBreakLength);
        }

        onComplete();
      } else {
        setMode("pomodoro");
        setTimeLeft(currentPreset.settings.pomodoroLength);
        addTimerLeftToPageTitle(currentPreset.settings.pomodoroLength);
      }

      toast(`${mode.charAt(0).toUpperCase() + mode.slice(1)} completed!`);
      new Audio("/sounds/tick_didi.mp3")
        .play()
        .then(() => {
          console.log("Audio played successfully");
        })
        .catch(() => {
          console.error("Failed to play audio");
        });
    }
    return () => clearInterval(interval);
  }, [
    status,
    timeLeft,
    mode,
    onComplete,
    currentPreset,
    pomodoroCount,
    startTime,
    onRecordUpdate,
    isRunning,
    currentTask?.title,
    currentTask?.skills,
  ]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getTimeForMode(newMode));
    setStatus(TimerStatus.Stopped);
    setStartTime(null);
  };

  const handleStartPause = () => {
    setStatus(isRunning ? TimerStatus.Paused : TimerStatus.Running);
    if (!isRunning) {
      setStartTime(new Date());
    }
  };

  const handleReset = () => {
    setTimeLeft(getTimeForMode(mode));
    setStatus(TimerStatus.Stopped);
    setStartTime(null);
  };

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 relative bg-gradient-to-br from-background to-muted shadow-lg">
      <TimerSettings
        isStopped={isStopped}
        preset={currentPreset}
        onSave={onSettingsChange}
      />

      <Tabs
        value={mode}
        onValueChange={(value) => handleModeChange(value as TimerMode)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger
            disabled={!isStopped}
            value="pomodoro"
            className="text-base cursor-pointer"
          >
            Pomodoro
          </TabsTrigger>
          <TabsTrigger
            disabled={!isStopped}
            value="shortBreak"
            className="text-base cursor-pointer"
          >
            Short Break
          </TabsTrigger>
          <TabsTrigger
            disabled={!isStopped}
            value="longBreak"
            className="text-base cursor-pointer"
          >
            Long Break
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {currentTask && (
        <div className="text-base text-muted-foreground text-center bg-muted/50 p-2 rounded-lg">
          Current Task:{" "}
          <span className="font-medium text-foreground">
            {currentTask.title}
          </span>
        </div>
      )}

      <div className="text-7xl font-bold text-center tabular-nums tracking-tight">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={handleStartPause}
          className={cn(
            "w-36 h-12 text-base",
            isRunning
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          )}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleReset}
          className="w-36 h-12 text-base"
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}
