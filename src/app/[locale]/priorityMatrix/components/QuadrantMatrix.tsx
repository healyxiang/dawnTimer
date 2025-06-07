"use client";

import { useCallback, useMemo, useRef, useEffect, useState } from "react";
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
    description: "Don’t Do It",
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

export const QuadrantMatrix = ({ tasks, onTaskMove }: QuadrantMatrixProps) => {
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
    // const quadrantNodes = Object.entries(QUADRANT_CONFIG).map(
    //   ([quadrant, config]) => ({
    //     id: quadrant,
    //     type: "quadrant",
    //     position: positions[quadrant as Quadrant],
    //     data: {
    //       quadrant: quadrant as Quadrant,
    //       title: config.title,
    //       description: config.description,
    //       tasks: tasks.filter((task) => task.quadrant === quadrant),
    //       onTaskUpdate,
    //     },
    //   })
    // );
    const taskNodes = tasksPositions.map((item) => {
      return {
        id: item.id,
        type: "task",
        position: item,
        data: { ...tasks.find((task) => task.id === item.id) },
      };
    });
    return [...taskNodes];
  }, [tasks, calculateTaskPositions]);

  const [nodesState, setNodesState, onNodesChange] =
    useNodesState(initialNodes);
  console.log("nodesState", nodesState);

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
      //   const quadrant = node.id as Quadrant;
      //   const taskId = node.data.id as string;
      console.log("node in onNodeDragStop:", node);
      //   onTaskMove(taskId, quadrant);
    },
    [onTaskMove]
  );

  const nodeTypes: NodeTypes = {
    task: (props) => (
      <TaskNodeComponent
        data={props.data}
        onTaskUpdate={props.data.onTaskUpdate}
      />
    ),
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] border rounded-lg relative">
      <ReactFlow
        nodes={nodesState}
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
          <div className="flex items-center justify-center">
            <QuadrantNodeComponent
              data={{
                quadrant: "urgent-important",
                title: QUADRANT_CONFIG["urgent-important"].title,
                description: QUADRANT_CONFIG["urgent-important"].description,
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <QuadrantNodeComponent
              data={{
                quadrant: "not-urgent-important",
                title: QUADRANT_CONFIG["not-urgent-important"].title,
                description:
                  QUADRANT_CONFIG["not-urgent-important"].description,
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <QuadrantNodeComponent
              data={{
                quadrant: "urgent-not-important",
                title: QUADRANT_CONFIG["urgent-not-important"].title,
                description:
                  QUADRANT_CONFIG["urgent-not-important"].description,
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <QuadrantNodeComponent
              data={{
                quadrant: "not-urgent-not-important",
                title: QUADRANT_CONFIG["not-urgent-not-important"].title,
                description:
                  QUADRANT_CONFIG["not-urgent-not-important"].description,
              }}
            />
          </div>
        </div>
      </ReactFlow>
    </div>
  );
};
