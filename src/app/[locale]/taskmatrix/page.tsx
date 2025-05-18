"use client";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TaskMatrix } from "./components/TaskMatrix";

export default function TaskMatrixPage() {
  return (
    <div className="relative h-[calc(100vh-8rem)] p-2">
      {/* <h1 className="text-2xl font-bold mb-4">四象限任务管理</h1> */}
      <ReactFlowProvider>
        <TaskMatrix />
      </ReactFlowProvider>
    </div>
  );
}
