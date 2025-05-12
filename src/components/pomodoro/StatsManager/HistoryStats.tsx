"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TimerRecord, Skill } from "@/types/pomodoro";
import { History } from "lucide-react";

interface HistoryStatsProps {
  timerRecords: TimerRecord[];
  skills: Skill[];
}

const NoHistory = () => (
  <div className="flex flex-col items-center justify-center text-center space-y-3 mt-4">
    <History className="h-8 w-8 text-muted-foreground" />
    <div className="text-lg font-medium">No history records</div>
    <div className="text-sm text-muted-foreground">
      Complete some timer sessions to see your history here.
    </div>
  </div>
);

export function HistoryStats({ timerRecords, skills }: HistoryStatsProps) {
  const typeColors = {
    pomodoro: "bg-blue-200 text-blue-800",
    focus: "bg-blue-200 text-blue-800",
    shortBreak: "bg-green-200 text-green-800",
    longBreak: "bg-yellow-200 text-yellow-800",
  };

  const typeLabels = {
    pomodoro: "Pomodoro",
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timerRecords.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                <NoHistory />
              </TableCell>
            </TableRow>
          ) : null}
          {timerRecords
            .sort(
              (a, b) =>
                new Date(b.startTime).getTime() -
                new Date(a.startTime).getTime()
            )
            .map((record) => {
              const startDate = new Date(record.startTime);

              return (
                <TableRow key={startDate.getTime()}>
                  <TableCell>
                    <Badge className={typeColors[record.type]}>
                      {typeLabels[record.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.taskName ? (
                      record.taskName
                    ) : (
                      <span className="text-muted-foreground italic">
                        No task
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.skillIds
                      ?.map((skillId) => {
                        const skill = skills.find((s) => s.id === skillId);
                        return skill?.name;
                      })
                      .join(", ")}
                  </TableCell>
                  <TableCell>{record.duration} min</TableCell>
                  <TableCell>{startDate.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {startDate.toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Card>
  );
}
