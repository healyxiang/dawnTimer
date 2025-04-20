"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, Skill, TimerRecord } from "@/types/pomodoro";
import { DateRange } from "react-day-picker";
import { NonUndefined } from "@/types/common";
import { TimerStats } from "./TimerStats";
import { HistoryStats } from "./HistoryStats";
import { DateManager } from "./DateManager";

interface StatsManagerProps {
  tasks: Task[];
  skills: Skill[];
  timerRecords: TimerRecord[];
}

export type DateRangeRequired = {
  [K in keyof DateRange]-?: NonUndefined<DateRange[K]>;
};

export function StatsManager({
  tasks,
  skills,
  timerRecords,
}: StatsManagerProps) {
  const [dateRange, setDateRange] = useState<DateRangeRequired>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date(new Date().setHours(23, 59, 59, 999)),
  });

  const filteredRecords = timerRecords.filter((record) => {
    if (!dateRange.from || !dateRange.to) return true;
    const recordDate = new Date(record.startTime);
    return recordDate >= dateRange.from && recordDate <= dateRange.to;
  });

  return (
    <Card className="p-6 space-y-6 bg-card/50">
      <h2 className="text-2xl font-bold text-center">Statistics</h2>
      <DateManager
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        timerRecords={timerRecords}
      />
      <Tabs defaultValue="dashboard" className="w-full gap-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TimerStats
            timerRecords={filteredRecords}
            skills={skills}
            tasks={tasks}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistoryStats timerRecords={filteredRecords} skills={skills} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
