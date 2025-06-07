"use client";

import { useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { QuadrantMatrix } from "./components/QuadrantMatrix";
// import { TaskForm } from "./components/TaskForm";
import { Task, Quadrant, Priority } from "./types";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";

const mockTasks = [
  {
    id: "1",
    title: "任务1",
    description: "任务1描述",
    quadrant: "urgent-important" as Quadrant,
    completed: false,
    priority: "low" as Priority,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "任务2",
    description: "任务2描述",
    quadrant: "not-urgent-important" as Quadrant,
    completed: false,
    priority: "low" as Priority,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
export default function PriorityMatrixPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  //   const handleAddTask = (
  //     taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  //   ) => {
  //     const newTask: Task = {
  //       ...taskData,
  //       id: Date.now().toString(),
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };
  //     setTasks([...tasks, newTask]);
  //   };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const handleTaskMove = (taskId: string, newQuadrant: Quadrant) => {
    handleTaskUpdate(taskId, { quadrant: newQuadrant });
  };

  //   const handleTaskDelete = (taskId: string) => {
  //     setTasks(tasks.filter((task) => task.id !== taskId));
  //   };

  return (
    <div className="mx-auto px-8 py-1">
      {/* <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">四象限任务管理</h1>
        <TaskForm
          onSubmit={handleAddTask}
          trigger={
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              添加任务
            </Button>
          }
        />
      </div> */}

      <ReactFlowProvider>
        <QuadrantMatrix
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskUpdate={handleTaskUpdate}
        />
      </ReactFlowProvider>
    </div>
  );
}
