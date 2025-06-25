"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimerMode, TimerRecord, TimerPreset } from "@/types/pomodoro";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimerSetting } from "../TimerSetting";
import { DEFAULT_PRESETS } from "@/constants/pomodoro";
import { FOCUS_TIMER_TDK, AUDIO_FILES } from "@/constants/common";

import { getTimerSettings, addTimerRecord } from "@/service/pomodoro";
import { useCurrentTaskStore } from "@/store/currentTask";

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

export function TimerManager() {
  const [timerStatus, setTimerStatus] = useState<TimerStatusValue>(
    TimerStatus.Stopped
  );
  const [currentPreset, setCurrentPreset] = useState<TimerPreset>(
    DEFAULT_PRESETS[0]
  );
  const [pomodoroCount, setPomodoroCount] = useState<number>(1);
  const [mode, setMode] = useState<TimerMode>("pomodoro");

  const { currentTask } = useCurrentTaskStore();

  const startTimeRef = useRef<Date | null>(null);
  const timeLeftRef = useRef<number>(DEFAULT_PRESETS[0].pomodoroLength);

  const timerRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const isRunning = timerStatus === TimerStatus.Running;
  const isStopped = timerStatus === TimerStatus.Stopped;

  const handleTimerComplete = useCallback(async (record: TimerRecord) => {
    // if (!currentTask) {
    //   toast.error("No task selected");
    //   return;
    // }

    try {
      // 更新计时记录
      await addTimerRecord(record);
      // setTimerRecords((prev) => [...prev, record]);
    } catch (error) {
      console.error("Error handling timer complete:", error);
      toast.error("Failed to save timer record");
    }
  }, []);

  const getTimeForMode = useCallback(
    (mode: TimerMode) => {
      switch (mode) {
        case "pomodoro":
          return currentPreset.pomodoroLength;
        case "shortBreak":
          return currentPreset.shortBreakLength;
        case "longBreak":
          return currentPreset.longBreakLength;
      }
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

  const updateTimerAfterPomodoro = useCallback(() => {
    const newCount = pomodoroCount + 1;

    setPomodoroCount(newCount);

    // 根据pomodoroCount来确定下一个mode
    if (newCount % currentPreset.longBreakInterval === 0) {
      setMode("longBreak");
      updateTimeLeft(currentPreset.longBreakLength);
    } else {
      setMode("shortBreak");
      updateTimeLeft(currentPreset.shortBreakLength);
    }

    const duration = Math.round(getTimeForMode(mode) / 60);

    const record: TimerRecord = {
      id: Date.now().toString(),
      startTime: startTimeRef.current?.toISOString() || "",
      endTime: new Date().toISOString(),
      duration,
      round: pomodoroCount,
      type: mode,
      taskId: currentTask?.id,
      skillIds: currentTask?.skills?.map((skill) => skill.id),
    };
    console.log("record::", record);
    handleTimerComplete(record);
  }, [
    currentPreset.longBreakInterval,
    currentPreset.longBreakLength,
    currentPreset.shortBreakLength,
    currentTask?.skills,
    currentTask?.id,
    getTimeForMode,
    mode,
    handleTimerComplete,
    pomodoroCount,
    updateTimeLeft,
  ]);

  const updateTimerAfterShortBreak = useCallback(() => {
    if (pomodoroCount % currentPreset.longBreakInterval === 0) {
      setMode("longBreak");
      updateTimeLeft(currentPreset.longBreakLength);
    } else {
      setMode("pomodoro");
      updateTimeLeft(currentPreset.pomodoroLength);
    }
  }, [
    currentPreset.longBreakInterval,
    currentPreset.longBreakLength,
    currentPreset.pomodoroLength,
    pomodoroCount,
    updateTimeLeft,
  ]);

  const updateTimerAfterLongBreak = useCallback(() => {
    setMode("pomodoro");
    setPomodoroCount(1);
    updateTimeLeft(currentPreset.pomodoroLength);
  }, [currentPreset.pomodoroLength, updateTimeLeft]);

  useEffect(() => {
    // 启动Pomodoro倒计时
    function updateTimer() {
      clearTimer();
      if (timerStatus === TimerStatus.Running) {
        if (timeLeftRef.current > 0) {
          // 继续计时
          if (!startTimeRef.current) {
            // 开始计时
            startTimeRef.current = new Date();
            console.log("startTime::", startTimeRef.current);
          }
          const newTimeLeft = timeLeftRef.current - 1;
          updateTimeLeft(newTimeLeft);
          addTimerLeftToPageTitle(newTimeLeft);
          timerInterval.current = setTimeout(() => {
            updateTimer();
          }, 1000);
        } else {
          // 计时结束
          // 判断接下来的阶段
          removeTimerLeftFromPageTitle();
          console.log("mode after timer end::", mode);
          if (mode === "pomodoro") {
            // 进入shortBreak 或者 longBreak
            updateTimerAfterPomodoro();
          }
          if (mode === "shortBreak") {
            // 进入longBreak 或者 pomodoro
            updateTimerAfterShortBreak();
          }
          if (mode === "longBreak") {
            // 进入pomodoro
            updateTimerAfterLongBreak();
          }

          toast(`${mode.charAt(0).toUpperCase() + mode.slice(1)} completed!`);
          playAudio();
          setTimerStatus(TimerStatus.Stopped);
        }
      }
    }
    if (timerStatus === TimerStatus.Running) {
      updateTimer();
    } else {
      clearTimer();
    }
    return () => {
      clearTimer();
    };
  }, [
    timerStatus,
    updateTimeLeft,
    clearTimer,
    mode,
    updateTimerAfterPomodoro,
    updateTimerAfterShortBreak,
    updateTimerAfterLongBreak,
  ]);

  // 当 currentPreset 变化时，重置所有状态
  useEffect(() => {
    console.log("currentPreset::", currentPreset);
    if (currentPreset.id) {
      setPomodoroCount(1);
      setMode("pomodoro");
      updateTimeLeft(currentPreset.pomodoroLength);
      startTimeRef.current = null;
    }
  }, [currentPreset, updateTimeLeft]);

  useEffect(() => {
    async function fetchPresets() {
      const presets = await getTimerSettings();
      console.log("presets in fetchPresets::", presets);
      if (presets) {
        setCurrentPreset(presets);
      }
    }
    fetchPresets();
  }, []);

  const handleModeChange = (newMode: TimerMode) => {
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
    setMode("pomodoro");
    updateTimeLeft(getTimeForMode("pomodoro"));
    clearTimer();
    removeTimerLeftFromPageTitle();
  }, [clearTimer, getTimeForMode, updateTimeLeft]);

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
          // onPresetUpdate={handlePresetUpdate}
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
        // 定时器直接修改dom
        ref={timerRef}
        className="text-7xl font-bold text-center tabular-nums tracking-tight"
      >
        25:00
      </div>

      <div
        className="flex items-center justify-center gap-2"
        aria-label={`Pomodoro progress: ${pomodoroCount} of ${currentPreset.longBreakInterval} sessions completed`}
      >
        {Array.from({ length: currentPreset.longBreakInterval }).map(
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
