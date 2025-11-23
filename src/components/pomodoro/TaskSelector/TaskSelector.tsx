"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task, QuadrantType } from "@/types/pomodoro";
import { cn } from "@/lib/utils";
import { useCurrentTaskStore } from "@/store/currentTask";
import { QUADRANT_TITLES } from "@/constants/common";

interface TaskSelectorProps {
  tasks: Task[];
}

type QuadrantFilter = QuadrantType | "all";

export function TaskSelector({ tasks }: TaskSelectorProps) {
  const { currentTask, setCurrentTask } = useCurrentTaskStore();
  const [selectedQuadrant, setSelectedQuadrant] =
    useState<QuadrantFilter>("all");

  // API 已经过滤了未删除的任务，这里根据象限过滤
  const availableTasks = tasks.filter((task) => {
    if (selectedQuadrant === "all") return true;
    return task.quadrant === selectedQuadrant;
  });

  const handleTaskSelect = (task: Task) => {
    // 如果点击的是已选中的任务，则取消选择
    if (currentTask?.id === task.id) {
      setCurrentTask(undefined);
    } else {
      setCurrentTask(task);
    }
  };

  return (
    <Card className="p-4 space-y-2 bg-card/50">
      <h2 className="text-sm font-semibold mb-3">选择专注任务</h2>

      {/* 象限选择器 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedQuadrant === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedQuadrant("all")}
          className="text-xs"
        >
          All
        </Button>
        {(Object.keys(QUADRANT_TITLES) as QuadrantType[]).map((quadrant) => (
          <Button
            key={quadrant}
            variant={selectedQuadrant === quadrant ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedQuadrant(quadrant)}
            className="text-xs"
            title={QUADRANT_TITLES[quadrant].title}
          >
            {QUADRANT_TITLES[quadrant].action}
          </Button>
        ))}
      </div>

      {availableTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {selectedQuadrant === "all"
            ? "暂无可用任务，请先创建任务"
            : `该象限暂无任务`}
        </p>
      ) : (
        <div className="space-y-1">
          {availableTasks.map((task) => {
            const isSelected = currentTask?.id === task.id;
            return (
              <div
                key={task.id}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer",
                  "border-2",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-muted/50"
                )}
                onClick={() => handleTaskSelect(task)}
                role="button"
                tabIndex={0}
                aria-label={`选择任务: ${task.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTaskSelect(task);
                  }
                }}
              >
                {/* 单选按钮样式 */}
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/50"
                  )}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={cn("font-medium text-sm", {
                      "line-through text-muted-foreground": task.completed,
                    })}
                  >
                    {task.title}
                  </div>
                  {task.skills && task.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.skills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="text-xs"
                          style={{ backgroundColor: skill.color || "gray" }}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
