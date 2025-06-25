"use client";
import { useDrop } from "react-dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUADRANT_TITLES } from "@/constants/common";
import { QuadrantType } from "@/types/pomodoro";

// 象限组件
export const Quadrant = ({
  quadrant,
  onDrop,
  onAddTask,
  disabled = false,
  children,
}: {
  quadrant: QuadrantType;
  onDrop: (id: string, quadrant: QuadrantType) => void;
  onAddTask: (quadrant: QuadrantType) => void;
  disabled: boolean;
  children: React.ReactNode;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: string; type: string }) => onDrop(item.id, quadrant),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const quadrantStyles = {
    q1: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
    q2: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
    q3: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800",
    q4: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
  };

  const quadrantColors = {
    q1: "text-green-700 dark:text-green-400",
    q2: "text-blue-700 dark:text-blue-400",
    q3: "text-yellow-700 dark:text-yellow-400",
    q4: "text-red-700 dark:text-red-400",
  };

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={`relative p-2 border-2 flex flex-col gap-2 border-dashed transition-colors duration-200 flex-1 min-h-[300px]
                 ${quadrantStyles[quadrant as keyof typeof quadrantStyles]}
                 ${isOver ? "border-opacity-100" : "border-opacity-50"}`}
    >
      {/* 象限标题和添加按钮 */}
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`font-semibold text-lg ${
            quadrantColors[quadrant as keyof typeof quadrantColors]
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="text-gray-500 dark:text-gray-400">
              {QUADRANT_TITLES[quadrant as keyof typeof QUADRANT_TITLES].title}
            </div>
            <div className="text-xl ">
              {QUADRANT_TITLES[quadrant as keyof typeof QUADRANT_TITLES].action}
            </div>
          </div>
        </h3>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={() => onAddTask(quadrant)}
          className="text-xs dark:border-gray-600 dark:hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* 任务列表 */}
      <div className="flex-1 flex flex-col gap-2">{children}</div>
    </div>
  );
};
