"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { FOCUS_TIMER_TDK, AUDIO_FILES } from "@/constants/common";

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

const TabItems = [
  {
    label: "Pomodoro",
    value: "pomodoro",
  },
  {
    label: "Short Break",
    value: "shortBreak",
  },
  {
    label: "Long Break",
    value: "longBreak",
  },
];

function playAudio() {
  new Audio(AUDIO_FILES["focus-end"])
    .play()
    .then(() => {
      console.log("Audio played successfully");
    })
    .catch(() => {
      console.error("Failed to play audio");
    });
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
  const startTimeRef = useRef<Date | null>(null);

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
    // 计时器 每一种mode都使用该计时器，通过effect的更新来更新计时器
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      if (!startTimeRef.current) {
        startTimeRef.current = new Date();
        console.log("startTime::", startTimeRef.current);
      }

      interval = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        addTimerLeftToPageTitle(timeLeft - 1);
        clearTimeout(interval);
      }, 1000);
    }
    return () => clearTimeout(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      // 计时器结束
      setStatus(TimerStatus.Stopped);

      if (startTimeRef.current) {
        // 记录计时器完成，计算时长，更新record
        const duration = Math.round(getTimeForMode(mode) / 60);

        const record: TimerRecord = {
          id: Date.now().toString(),
          startTime: startTimeRef.current.toISOString(),
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
        console.log("record duration::", duration);
        onRecordUpdate(record);
        startTimeRef.current = null;
      }

      if (mode === "pomodoro") {
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);

        // 根据pomodoroCount来确定下一个mode
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
      playAudio();
    }
  }, [
    status,
    getTimeForMode,
    timeLeft,
    mode,
    onComplete,
    currentPreset,
    pomodoroCount,
    onRecordUpdate,
    isRunning,
    currentTask?.title,
    currentTask?.skills,
  ]);

  // 当 currentPreset 变化时，重置所有状态
  useEffect(() => {
    if (currentPreset.id) {
      setMode("pomodoro");
      setTimeLeft(currentPreset.settings.pomodoroLength);
      setStatus(TimerStatus.Stopped);
      setPomodoroCount(0);
      startTimeRef.current = null;
    }
  }, [currentPreset.id, currentPreset.settings.pomodoroLength]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getTimeForMode(newMode));
    setStatus(TimerStatus.Stopped);
    startTimeRef.current = null;
  };

  const handleStartPause = () => {
    setStatus(isRunning ? TimerStatus.Paused : TimerStatus.Running);
    if (!isRunning) {
      startTimeRef.current = new Date();
      console.log("startTimeRef.current::", startTimeRef.current);
    }
  };

  const handleReset = () => {
    setTimeLeft(getTimeForMode(mode));
    setStatus(TimerStatus.Stopped);
    startTimeRef.current = null;
  };

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 relative bg-gradient-to-br from-background to-muted shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <Tabs
          value={mode}
          onValueChange={(value) => handleModeChange(value as TimerMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-10">
            {TabItems.map((item) => (
              <TabsTrigger
                key={item.value}
                disabled={!isStopped}
                value={item.value}
                className="text-base cursor-pointer"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <TimerSettings
          isStopped={isStopped}
          preset={currentPreset}
          onSave={onSettingsChange}
        />
      </div>

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

      <div
        className="flex items-center justify-center gap-2"
        aria-label={`Pomodoro progress: ${pomodoroCount} of ${currentPreset.settings.longBreakInterval} sessions completed`}
      >
        {Array.from({ length: currentPreset.settings.longBreakInterval }).map(
          (_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-1000",
                index < pomodoroCount
                  ? "bg-primary"
                  : index === pomodoroCount && mode === "pomodoro" && isRunning
                  ? "bg-primary/60 animate-pulse-ring border-2 border-primary/80 relative after:absolute after:inset-0 after:rounded-full after:animate-[ping_6s_ease-in-out_infinite]"
                  : "border-2 border-primary/80"
              )}
              aria-label={
                index < pomodoroCount
                  ? "Completed session"
                  : index === pomodoroCount && mode === "pomodoro" && isRunning
                  ? "Current active session"
                  : "Pending session"
              }
            />
          )
        )}
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
