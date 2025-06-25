import { Suspense } from "react";

import TaskManagerRSC from "@/components/pomodoro/TaskManager";
// import SkillManagerRSC from "@/components/pomodoro/SkillManager";
import StatsManagerRSC from "@/components/pomodoro/StatsManager";
import TimerManagerRSC from "@/components/pomodoro/TimerManager";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

function TaskManagerSkeleton() {
  return (
    <Card className="p-4 space-y-4 bg-card/50">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-3">
        {[1].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </Card>
  );
}

// function SkillManagerSkeleton() {
//   return (
//     <Card className="p-4 space-y-4 bg-card/50">
//       <div className="flex justify-between items-center">
//         <Skeleton className="h-6 w-24" />
//         <Skeleton className="h-10 w-24" />
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {[1].map((i) => (
//           <Skeleton key={i} className="h-8 w-24" />
//         ))}
//       </div>
//     </Card>
//   );
// }

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
        <div className="space-y-4 border p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Task Management
          </h2>
          <Suspense fallback={<TaskManagerSkeleton />}>
            <TaskManagerRSC />
          </Suspense>
          {/* TODO: 技能管理功能暂时关闭
           <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Skill Management
            </h2>
            <Suspense fallback={<SkillManagerSkeleton />}>
              <SkillManagerRSC />
            </Suspense>
          </div> */}
        </div>

        <div className="mt-8">
          <StatsManagerRSC />
        </div>
      </div>

      {/* <RatingDialog
        isOpen={isRatingDialogOpen}
        onClose={() => setIsRatingDialogOpen(false)}
        onSubmit={handleRatingSubmit}
      /> */}
    </div>
  );
}
