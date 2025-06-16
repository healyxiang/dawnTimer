"use client";

import { useCallback, useMemo, useRef, useEffect, useState, memo } from "react";
import {
  ReactFlow,
  Background,
  Node,
  useNodesState,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Task, Quadrant, QuadrantNode } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const QUADRANT_CONFIG = {
  "urgent-important": {
    title: "URGENT and IMPORTANT",
    description: "Do It First",
    color: "bg-green-400",
  },
  "not-urgent-important": {
    title: "NOT URGENT and IMPORTANT",
    description: "Schedule It",
    color: "bg-blue-500",
  },
  "urgent-not-important": {
    title: "URGENT and NOT IMPORTANT",
    description: "Delegate It",
    color: "bg-yellow-500",
  },
  "not-urgent-not-important": {
    title: "NOT URGENT and NOT IMPORTANT",
    description: "Don't Do It",
    color: "bg-gray-500",
  },
};

interface QuadrantMatrixProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newQuadrant: Quadrant) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

interface QuadrantNodeProps {
  data: QuadrantNode["data"];
}

// 清除所有象限的拖拽状态
const clearAllQuadrantDragging = () => {
  const quadrantElements = document.querySelectorAll("[data-quadrant]");
  quadrantElements.forEach((element) => {
    element.classList.remove("bg-opacity-20", "bg-blue-500");
  });
};

const nodeTypes: NodeTypes = {
  task: (props) => (
    <TaskNodeComponent
      data={props.data}
      onTaskUpdate={props.data.onTaskUpdate}
    />
  ),
};

const TaskNodeComponent = ({
  data,
  onTaskUpdate,
}: {
  data: Task;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}) => {
  return (
    <div
      key={data.id}
      className="flex items-center justify-between p-2 bg-white rounded shadow-sm"
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={data.completed}
          onCheckedChange={(checked) =>
            onTaskUpdate(data.id, { completed: checked as boolean })
          }
        />
        <span
          className={`${data.completed ? "line-through text-gray-500" : ""}`}
        >
          {data.title}
        </span>
      </div>
      {data.priority && (
        <Badge
          variant={
            data.priority === "high"
              ? "destructive"
              : data.priority === "medium"
              ? "default"
              : "secondary"
          }
        >
          {data.priority}
        </Badge>
      )}
    </div>
  );
};

const QuadrantNodeComponent = ({ data }: QuadrantNodeProps) => {
  return (
    <Card className="w-[calc(50vw-60px)] h-[calc(50vh-70px)] overflow-hidden rounded-sm py-1">
      <div className={`${QUADRANT_CONFIG[data.quadrant].color} p-4 text-white`}>
        <h3 className="font-bold">{data.title}</h3>
        <p className="text-sm opacity-80">{data.description}</p>
      </div>
    </Card>
  );
};

export const QuadrantMatrix = memo(
  ({ tasks, onTaskUpdate }: QuadrantMatrixProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // 监听容器尺寸变化
    useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setCanvasSize({ width, height });
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // 根据画布尺寸计算象限位置
    const calculateQuadrantPositions = useCallback(() => {
      const { width, height } = canvasSize;
      console.log("width, height", width, height);
      const padding = 20; // 边距
      const quadrantWidth = Math.floor(width / 2);
      const quadrantHeight = Math.floor(height / 2);

      return {
        "urgent-important": {
          x: padding, // 左上
          y: padding,
        },
        "not-urgent-important": {
          x: width - quadrantWidth - padding, // 右上
          y: padding,
        },
        "urgent-not-important": {
          x: padding, // 左下
          y: height - quadrantHeight + padding,
        },
        "not-urgent-not-important": {
          x: width - quadrantWidth - padding, // 右下
          y: height - quadrantHeight + padding,
        },
      };
    }, [canvasSize]);

    const calculateTaskPositions = useCallback(() => {
      const quadrantPositions = calculateQuadrantPositions();
      const tasksPositions = tasks.map((task, index) => {
        const quadrant = task.quadrant;
        const position = quadrantPositions[quadrant];
        return {
          id: task.id,
          x: position.x + 10,
          y: position.y + 30 + index * 20,
        };
      });
      return tasksPositions;
    }, [calculateQuadrantPositions, tasks]);

    // 生成节点
    const initialNodes = useMemo(() => {
      // const positions = calculateQuadrantPositions();
      const tasksPositions = calculateTaskPositions();
      const taskNodes = tasksPositions.map((item) => {
        return {
          id: item.id,
          type: "task",
          position: { x: item.x, y: item.y },
          data: { ...tasks.find((task) => task.id === item.id) },
        };
      });
      return [...taskNodes];
    }, [tasks, calculateTaskPositions]);

    const [nodesState, setNodesState, onNodesChange] =
      useNodesState(initialNodes);
    // console.log("nodesState", nodesState);

    // 当画布尺寸变化时更新节点位置
    useEffect(() => {
      // const positions = calculateQuadrantPositions();
      // const newNodes = nodesState.map((node) => ({
      //   ...node,
      //   position: positions[node.id as Quadrant],
      // }));
      // setNodesState(newNodes);
    }, [canvasSize, calculateQuadrantPositions, setNodesState]);

    const onNodeDragStop = useCallback(
      (event: React.MouseEvent, node: Node) => {
        if (!node.data?.id) return;

        // 获取节点最终位置
        const { x, y } = node.position;
        const { width, height } = canvasSize;

        // 计算象限
        let quadrant: Quadrant;
        if (x < width / 2) {
          // 左侧
          quadrant =
            y < height / 2 ? "urgent-important" : "urgent-not-important";
        } else {
          // 右侧
          quadrant =
            y < height / 2
              ? "not-urgent-important"
              : "not-urgent-not-important";
        }

        const targetTask = tasks.find((task) => task.id === node.data.id);
        if (targetTask) {
          targetTask.quadrant = quadrant;
          onTaskUpdate(targetTask.id, { ...targetTask });
        }
        console.log("quadrant:", quadrant);
        clearAllQuadrantDragging();
      },
      [canvasSize, onTaskUpdate, tasks]
    );

    // 添加拖拽时的视觉反馈
    const onNodeDrag = useCallback(
      (event: React.MouseEvent, node: Node) => {
        const { x, y } = node.position;
        const { width, height } = canvasSize;

        // 计算当前象限
        let currentQuadrant: Quadrant;
        if (x < width / 2) {
          currentQuadrant =
            y < height / 2 ? "urgent-important" : "urgent-not-important";
        } else {
          currentQuadrant =
            y < height / 2
              ? "not-urgent-important"
              : "not-urgent-not-important";
        }

        // 可以在这里添加视觉反馈，比如高亮当前象限
        const quadrantElement = document.querySelector(
          `[data-quadrant="${currentQuadrant}"]`
        );
        if (quadrantElement) {
          clearAllQuadrantDragging();
          quadrantElement.classList.add("bg-opacity-20", "bg-blue-500");
        }
      },
      [canvasSize]
    );

    return (
      <div
        ref={containerRef}
        className="w-full h-[calc(100vh-100px)] border rounded-lg relative"
      >
        <ReactFlow
          nodes={nodesState}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          panOnDrag={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          maxZoom={1}
          minZoom={1}
          fitView={false}
        >
          <Background />
          <div className="w-full h-full inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2">
            {Object.entries(QUADRANT_CONFIG).map(([quadrant, config]) => (
              <div
                key={quadrant}
                className="flex items-center justify-center transition-colors duration-200"
                data-quadrant={quadrant}
              >
                <QuadrantNodeComponent
                  data={{
                    quadrant: quadrant as Quadrant,
                    title: config.title,
                    description: config.description,
                  }}
                />
              </div>
            ))}
          </div>
        </ReactFlow>
      </div>
    );
  }
);

QuadrantMatrix.displayName = "QuadrantMatrix";
