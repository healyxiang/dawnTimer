"use client";

import { Card } from "@/components/ui/card";
import { Skill, Task, TimerRecord } from "@/types/pomodoro";
import { Clock } from "lucide-react";

import { formatTime } from "@/lib/utils";
import { SkillStats } from "./SkillStats";
import { DateRangeRequired } from "./index";

interface TimerStatsProps {
  timerRecords: TimerRecord[];
  skills: Skill[];
  tasks: Task[];
  dateRange: DateRangeRequired;
}

const CardItem = ({ title, value }: { title: string; value: number }) => (
  <div>
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-xl font-semibold">{formatTime(value)}</div>
  </div>
);

export function TimerStats({
  timerRecords,
  skills,
  tasks,
  dateRange,
}: TimerStatsProps) {
  const getAllTimeFocusTime = () => {
    return timerRecords
      .filter((record) => record.type === "pomodoro")
      .reduce((sum, record) => sum + record.duration, 0);
  };

  // 获取日期范围内的专注时间
  const getRangeFocusTime = (from: Date, to: Date) => {
    return timerRecords
      .filter((record) => {
        const recordDate = new Date(record.startTime);
        return (
          record.type === "pomodoro" && recordDate >= from && recordDate <= to
        );
      })
      .reduce((sum, record) => sum + record.duration, 0);
  };

  // 获取最近N天的专注时间
  const getRecentFocusTime = (days: number) => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999);

    return getRangeFocusTime(startDate, now);
  };

  // 获取日期范围内的平均专注时间
  const getRangeAverageFocusTime = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    const totalTime = getRangeFocusTime(dateRange.from, dateRange.to);
    const days =
      Math.ceil(
        (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return Math.round(totalTime / days);
  };

  const rangeFocusTime = getRangeFocusTime(dateRange.from, dateRange.to);
  const averageFocusTime = getRangeAverageFocusTime();
  const sevenDaysFocus = getRecentFocusTime(7);
  const thirtyDaysFocus = getRecentFocusTime(30);
  const yearFocus = getRecentFocusTime(365);
  const allTimeFocus = getAllTimeFocusTime();

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold flex items-center gap-4">
            <Clock className="w-8 h-8 text-green-500" />
            {formatTime(rangeFocusTime)}
          </div>
          <div className="text-yellow-500">
            ↓ {formatTime(Math.abs(rangeFocusTime - averageFocusTime))} less
            than avg.
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center divide-x mt-4">
          <CardItem title="Last 7 Days" value={sevenDaysFocus} />
          <CardItem title="Last 30 Days" value={thirtyDaysFocus} />
          <CardItem title="Last 365 Days" value={yearFocus} />
          <CardItem title="All Time" value={allTimeFocus} />
        </div>
      </Card>
      {skills.length > 0 && tasks.length > 0 && (
        <SkillStats skills={skills} timerRecords={timerRecords} />
      )}
    </div>
  );
}
