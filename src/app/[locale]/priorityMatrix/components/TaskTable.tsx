"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task, Quadrant } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// import { useState } from "react";

interface TaskTableProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

const QUADRANT_LABELS: Record<Quadrant, string> = {
  "urgent-important": "紧急且重要",
  "not-urgent-important": "不紧急但重要",
  "urgent-not-important": "紧急但不重要",
  "not-urgent-not-important": "不紧急且不重要",
};

export const TaskTable = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
}: TaskTableProps) => {
  //   const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    onTaskUpdate(taskId, { completed });
  };

  const handleQuadrantChange = (taskId: string, quadrant: Quadrant) => {
    onTaskUpdate(taskId, { quadrant });
  };

  return (
    <div className="mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>完成</TableHead>
            <TableHead>标题</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>象限</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) =>
                    handleTaskComplete(task.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <select
                  value={task.quadrant}
                  onChange={(e) =>
                    handleQuadrantChange(task.id, e.target.value as Quadrant)
                  }
                  className="border rounded px-2 py-1"
                >
                  {Object.entries(QUADRANT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onTaskDelete(task.id)}
                >
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
