import { TaskSelector } from "./TaskSelector";
import { getTasksByDB } from "@/app/api/lib/pomodoro";

export { TaskSelector };

export default async function TaskSelectorRSC() {
  const tasks = await getTasksByDB();

  return <TaskSelector tasks={tasks} />;
}
