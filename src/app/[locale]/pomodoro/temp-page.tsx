import { Suspense } from "react";

import TaskManagerRSC from "@/components/pomodoro/TaskManager";
import SkillManagerRSC from "@/components/pomodoro/SkillManager";
export default function PomodoroPage() {
  return (
    <Suspense fallback={"loading loading loading "}>
      <TaskManagerRSC />
      <SkillManagerRSC />
    </Suspense>
  );
}
