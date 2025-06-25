"use client";
import { useCallback, useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskNode } from "./TaskNode";
import { Quadrant } from "./Quadrant";
import { TaskDialog } from "@/components/pomodoro/TaskManager/TaskDialog";
import { Task, QuadrantType } from "@/types/pomodoro";
import useTask from "@/hooks/useTask";

export const TaskMatrix = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType>("q1");

  // Use the task hook with API calls
  const { tasks, isLoading, error, addTask, updateTask, deleteTask } = useTask({
    autoFetch: true, // 自动从 API 获取任务
  });

  // 删除任务
  const handleDeleteTask = useCallback(
    async (id: string) => {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    [deleteTask]
  );

  // 移动任务到新象限
  const handleMoveTask = useCallback(
    async (id: string, quadrant: QuadrantType) => {
      try {
        await updateTask(id, { quadrant });
      } catch (error) {
        console.error("Error moving task:", error);
      }
    },
    [updateTask]
  );

  // 添加新任务到指定象限
  const handleAddTask = useCallback((quadrant: QuadrantType) => {
    setSelectedQuadrant(quadrant);
    setEditingTask(undefined);
    setIsDialogOpen(true);
  }, []);

  // 编辑任务
  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setSelectedQuadrant(task.quadrant);
    setIsDialogOpen(true);
  }, []);

  // 处理任务提交（创建或编辑）
  const handleSubmitTask = useCallback(
    async (
      taskData: Omit<
        Task,
        "pomodoroRatings" | "createdAt" | "updatedAt" | "id"
      > & {
        id?: string;
      }
    ) => {
      try {
        if (editingTask) {
          // 编辑现有任务
          await updateTask(editingTask.id, {
            title: taskData.title,
            description: taskData.description,
            skillIds: taskData.skillIds,
            skills: taskData.skills,
            completed: taskData.completed,
            quadrant: taskData.quadrant,
          });
        } else {
          // 创建新任务
          await addTask({
            ...taskData,
            quadrant: selectedQuadrant, // 使用选中的象限
          });
        }
        setIsDialogOpen(false);
        setEditingTask(undefined);
      } catch (error) {
        console.error("Error submitting task:", error);
        // 错误已在 hook 中处理并显示 toast
      }
    },
    [editingTask, selectedQuadrant, addTask, updateTask]
  );

  // 按象限分组任务
  const tasksByQuadrant = {
    q1: tasks.filter((task) => task.quadrant === "q1"),
    q2: tasks.filter((task) => task.quadrant === "q2"),
    q3: tasks.filter((task) => task.quadrant === "q3"),
    q4: tasks.filter((task) => task.quadrant === "q4"),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="w-full border-gray-300 dark:border-gray-600 relative bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
        ref={containerRef}
      >
        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* 象限网格 */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1">
          {/* 移动端：垂直布局 q1 -> q2 -> q3 -> q4 */}
          {/* 桌面端：2x2 网格布局 */}

          {/* Q1 象限 */}
          <Quadrant
            quadrant="q1"
            onDrop={handleMoveTask}
            onAddTask={handleAddTask}
            disabled={isLoading}
          >
            {tasksByQuadrant.q1.map((task) => (
              <TaskNode
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </Quadrant>

          {/* Q2 象限 */}
          <Quadrant
            quadrant="q2"
            onDrop={handleMoveTask}
            onAddTask={handleAddTask}
            disabled={isLoading}
          >
            {tasksByQuadrant.q2.map((task) => (
              <TaskNode
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </Quadrant>

          {/* Q3 象限 */}
          <Quadrant
            quadrant="q3"
            onDrop={handleMoveTask}
            onAddTask={handleAddTask}
            disabled={isLoading}
          >
            {tasksByQuadrant.q3.map((task) => (
              <TaskNode
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </Quadrant>

          {/* Q4 象限 */}
          <Quadrant
            quadrant="q4"
            onDrop={handleMoveTask}
            onAddTask={handleAddTask}
            disabled={isLoading}
          >
            {tasksByQuadrant.q4.map((task) => (
              <TaskNode
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </Quadrant>
        </div>

        {/* TaskDialog */}
        <TaskDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingTask(undefined);
          }}
          onSubmit={handleSubmitTask}
          skills={[]}
          task={
            editingTask
              ? {
                  ...editingTask,
                }
              : undefined
          }
        />
      </div>
    </DndProvider>
  );
};
