"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimerRecord, TimerPreset } from "@/types/pomodoro";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimerSetting } from "../TimerSetting";
import { DEFAULT_PRESETS } from "@/constants/pomodoro";
import { FOCUS_TIMER_TDK, AUDIO_FILES } from "@/constants/common";

import { useTimerSettings, addTimerRecord } from "@/service/pomodoro";
import { useCurrentTaskStore } from "@/store/currentTask";

const TimerStatus = {
  Running: "running",
  Paused: "paused",
  Stopped: "stopped",
} as const;

type TimerStatusValue = (typeof TimerStatus)[keyof typeof TimerStatus];

// 简化为两种模式
type SimpleTimerMode = "task" | "break";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const addTimerLeftToPageTitle = (timeLeft: number) => {
  document.title = `${formatTime(timeLeft)} - ${FOCUS_TIMER_TDK.title}`;
};

const removeTimerLeftFromPageTitle = () => {
  document.title =
    (FOCUS_TIMER_TDK.title as string) || "DawnLibrary Focus Timer";
};

const TabItems = [
  { label: "Task", value: "task" },
  { label: "Break", value: "break" },
];

const playAudio = () => {
  new Audio(AUDIO_FILES["focus-end"])
    .play()
    .then(() => console.log("Audio played successfully"))
    .catch(() => console.error("Failed to play audio"));
};

export function TimerManager() {
  const [timerStatus, setTimerStatus] = useState<TimerStatusValue>(
    TimerStatus.Stopped
  );
  const [currentPreset, setCurrentPreset] = useState<TimerPreset>(
    DEFAULT_PRESETS[0]
  );
  const [mode, setMode] = useState<SimpleTimerMode>("task");

  const currentTask = useCurrentTaskStore((state) => state.currentTask);
  const { preset: fetchedPreset } = useTimerSettings();

  const startTimeRef = useRef<Date | null>(null);
  const timeLeftRef = useRef<number>(DEFAULT_PRESETS[0].pomodoroLength);
  const timerRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const isRunning = timerStatus === TimerStatus.Running;
  const isStopped = timerStatus === TimerStatus.Stopped;

  const getTimeForMode = useCallback(
    (targetMode: SimpleTimerMode) => {
      return targetMode === "task"
        ? currentPreset.pomodoroLength
        : currentPreset.shortBreakLength;
    },
    [currentPreset]
  );

  const updateTimeLeft = useCallback((newTimeLeft: number) => {
    if (timerRef.current) {
      timeLeftRef.current = newTimeLeft;
      timerRef.current.textContent = formatTime(newTimeLeft);
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (timerInterval.current) {
      clearTimeout(timerInterval.current);
    }
  }, []);

  const handleTimerComplete = useCallback(async (record: TimerRecord) => {
    try {
      await addTimerRecord(record);
    } catch (error) {
      console.error("Error handling timer complete:", error);
      toast.error("Failed to save timer record");
    }
  }, []);

  const handleModeComplete = useCallback(() => {
    removeTimerLeftFromPageTitle();

    if (mode === "task") {
      // Task 完成，记录并切换到 Break
      const duration = Math.round(getTimeForMode("task") / 60);
      const record: TimerRecord = {
        id: Date.now().toString(),
        startTime: startTimeRef.current?.toISOString() || "",
        endTime: new Date().toISOString(),
        duration,
        round: 1,
        type: "pomodoro", // 保持与后端兼容
        taskId: currentTask?.id,
        skillIds: currentTask?.skills?.map((skill) => skill.id),
      };
      console.log("record::", record);
      handleTimerComplete(record);

      setMode("break");
      updateTimeLeft(currentPreset.shortBreakLength);
    } else {
      // Break 完成，切换回 Task
      setMode("task");
      updateTimeLeft(currentPreset.pomodoroLength);
    }

    toast(`${mode === "task" ? "Task" : "Break"} completed!`);
    playAudio();
    setTimerStatus(TimerStatus.Stopped);
    startTimeRef.current = null;
  }, [
    mode,
    currentTask,
    currentPreset,
    getTimeForMode,
    handleTimerComplete,
    updateTimeLeft,
  ]);

  // 计时器主逻辑
  useEffect(() => {
    const updateTimer = () => {
      clearTimer();

      if (timerStatus !== TimerStatus.Running) return;

      if (timeLeftRef.current > 0) {
        if (!startTimeRef.current) {
          startTimeRef.current = new Date();
        }
        const newTimeLeft = timeLeftRef.current - 1;
        updateTimeLeft(newTimeLeft);
        addTimerLeftToPageTitle(newTimeLeft);
        timerInterval.current = setTimeout(updateTimer, 1000);
      } else {
        handleModeComplete();
      }
    };

    if (timerStatus === TimerStatus.Running) {
      updateTimer();
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [timerStatus, updateTimeLeft, clearTimer, handleModeComplete]);

  // 当 SWR 获取到 preset 时，更新 currentPreset
  useEffect(() => {
    if (fetchedPreset) {
      setCurrentPreset(fetchedPreset);
    }
  }, [fetchedPreset]);

  // 当 currentPreset 变化时，重置所有状态
  useEffect(() => {
    if (currentPreset.id) {
      setMode("task");
      updateTimeLeft(currentPreset.pomodoroLength);
      startTimeRef.current = null;
    }
  }, [currentPreset, updateTimeLeft]);

  const handleModeChange = (newMode: SimpleTimerMode) => {
    setMode(newMode);
    updateTimeLeft(getTimeForMode(newMode));
    startTimeRef.current = null;
  };

  const handleStartPause = () => {
    if (
      timerStatus === TimerStatus.Paused ||
      timerStatus === TimerStatus.Stopped
    ) {
      setTimerStatus(TimerStatus.Running);
    } else {
      setTimerStatus(TimerStatus.Paused);
    }
  };

  const handleReset = useCallback(() => {
    startTimeRef.current = null;
    setTimerStatus(TimerStatus.Stopped);
    setMode("task");
    updateTimeLeft(getTimeForMode("task"));
    clearTimer();
    removeTimerLeftFromPageTitle();
  }, [clearTimer, getTimeForMode, updateTimeLeft]);

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 relative bg-linear-to-br from-background to-muted shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <Tabs
          value={mode}
          onValueChange={(value) => handleModeChange(value as SimpleTimerMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-10">
            {TabItems.map((item) => (
              <TabsTrigger
                key={item.value}
                disabled={timerStatus === TimerStatus.Running}
                value={item.value}
                className="text-base cursor-pointer"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <TimerSetting
          disabled={!isStopped}
          currentPreset={currentPreset}
          onPresetChange={(preset) => setCurrentPreset(preset)}
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

      <div
        ref={timerRef}
        className="text-7xl font-bold text-center tabular-nums tracking-tight"
      >
        {formatTime(getTimeForMode(mode))}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={handleStartPause}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
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
          aria-label="Reset timer"
          className="w-36 h-12 text-base"
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}
