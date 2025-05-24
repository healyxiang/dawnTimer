import { TaskManager } from "./TaskManager";
import { getTasksByDB } from "@/app/api/lib/pomodoro";

export { TaskManager };

export default async function TaskManagerRSC() {
  const tasks = await getTasksByDB();
  console.log("tasks tasks:", tasks);

  return (
    <TaskManager
      tasks={tasks}
      skills={[]}
      //   onAddTask={emptyFunc}
      //   onCompleteTask={emptyFunc}
      //   onTaskSelect={emptyFunc}
      //   onDeleteTask={emptyFunc}
    />
  );
}
