import { Suspense } from "react";

import TaskSelectorRSC from "@/components/pomodoro/TaskSelector";
import StatsManagerRSC from "@/components/pomodoro/StatsManager";
import TimerManagerRSC from "@/components/pomodoro/TimerManager";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

function TaskSelectorSkeleton() {
  return (
    <Card className="p-4 space-y-4 bg-card/50">
      <Skeleton className="h-6 w-32 mb-3" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </Card>
  );
}

export default function PomodoroApp() {
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
        <TimerManagerRSC />
      </div>

      <div className={cn("grid grid-cols-1 gap-8 grow", "md:w-full")}>
        <div className="rounded-lg">
          <Suspense fallback={<TaskSelectorSkeleton />}>
            <TaskSelectorRSC />
          </Suspense>
        </div>

        <div className="mt-8">
          <StatsManagerRSC />
        </div>
      </div>
    </div>
  );
}
