"use client";
import { useDrag } from "react-dnd";
import { X, Edit } from "lucide-react";
import { Task } from "@/types/pomodoro";

// 扩展 Task 类型以包含 quadrant 属性

// 任务节点组件
export const TaskNode = ({
  task,
  onDelete,
  onEdit,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id, type: "task" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      className={`p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 relative group cursor-move flex justify-between
                 ${isDragging ? "opacity-50" : "opacity-100"}
                 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200`}
      style={{
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <div className="flex gap-2 items-center">
        <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {task.title}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {task.description}
        </div>
      </div>
      <div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                   hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="编辑任务"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-md 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                   hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="删除任务"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
