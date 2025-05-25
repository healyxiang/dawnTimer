"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimerRecord } from "@/types/pomodoro";
import { DateRangeRequired } from "./StatsManager";
const DateSelectRanges = [
  { label: "Today", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "All", value: "all" },
];

interface DateManagerProps {
  dateRange: DateRangeRequired;
  onDateRangeChange: (range: DateRangeRequired) => void;
  timerRecords: TimerRecord[];
}

export function DateManager({
  dateRange,
  onDateRangeChange,
  timerRecords,
}: DateManagerProps) {
  const handleRangeSelect = (value: string) => {
    const now = new Date(new Date().setHours(23, 59, 59, 999));
    const from = new Date(new Date().setHours(0, 0, 0, 0));

    switch (value) {
      case "today":
        onDateRangeChange({ from, to: now });
        break;
      case "week":
        from.setDate(now.getDate() - 7);
        onDateRangeChange({ from, to: now });
        break;
      case "month":
        from.setDate(now.getDate() - 30);
        onDateRangeChange({ from, to: now });
        break;
      case "year":
        from.setDate(now.getDate() - 365);
        onDateRangeChange({ from, to: now });
        break;
      case "all":
        const earliest = new Date(
          Math.min(...timerRecords.map((r) => new Date(r.startTime).getTime()))
        );
        onDateRangeChange({ from: earliest, to: now });
        break;
    }
  };

  return (
    <div className={cn("flex justify-between mb-4", "sm:flex-col sm:gap-2")}>
      <div className="text-xl font-bold">Your Focus Time</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "yyyy/MM/dd")} -{" "}
                  {format(dateRange.to, "yyyy/MM/dd")}
                </>
              ) : (
                format(dateRange.from, "yyyy/MM/dd")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex">
          <div className="border-b p-3">
            <div className="flex flex-col gap-2">
              {DateSelectRanges.map((range) => (
                <Button
                  key={range.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRangeSelect(range.value)}
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              if (range) {
                onDateRangeChange(range as DateRangeRequired);
              }
            }}
            disabled={{ after: new Date() }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
