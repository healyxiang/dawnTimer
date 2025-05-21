// src/app/[locale]/taskmatrix/components/TaskMatrix.tsx

// 动态导入，禁用 SSR
import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
// import { QuadrantNode } from "./QuadrantNode";
// import { TaskNode } from "./TaskNode";
// import { AxisNode } from "./AxisNode";
import { X } from "lucide-react"; // 导入删除图标

// const nodeTypes: NodeTypes = {
//   quadrant: QuadrantNode,
//   task: TaskNode,
//   axis: AxisNode,
// };

const QuadrantGrid = () => {
  const axisStyle = {
    stroke: "#94a3b8",
    strokeWidth: 2,
  };

  return (
    <svg className="absolute w-full h-full">
      {/* X轴 */}
      <line x1="0" y1="50%" x2="100%" y2="50%" style={axisStyle} />
      {/* Y轴 */}
      <line x1="50%" y1="0" x2="50%" y2="100%" style={axisStyle} />
      {/* 象限标签 */}
      <text x="25%" y="25%" textAnchor="middle" fill="red" fontSize="14">
        重要-紧急
      </text>
      <text x="75%" y="25%" textAnchor="middle" fill="#64748b" fontSize="14">
        不重要-紧急
      </text>
      <text x="25%" y="75%" textAnchor="middle" fill="green" fontSize="14">
        重要-不紧急
      </text>
      <text x="75%" y="75%" textAnchor="middle" fill="#64748b" fontSize="14">
        不重要-不紧急
      </text>
    </svg>
  );
};

// 任务节点类型
const TaskNode = ({
  data,
  id,
}: {
  data: { label: string; priority: string };
  id: string;
}) => {
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 阻止事件冒泡
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
    },
    [id, setNodes]
  );

  return (
    <div className="p-3 bg-white rounded-lg shadow-md border border-gray-200 relative group">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="删除任务"
      >
        <X className="w-3 h-3" />
      </button>
      <div className="font-medium text-sm">{data.label}</div>
      <div className="text-sm text-gray-500">{data.priority}</div>
    </div>
  );
};

const nodeTypes = { task: TaskNode };

// 判断点击位置属于哪个象限
const getQuadrant = (
  x: number,
  y: number,
  centerX: number,
  centerY: number
) => {
  console.log("x y centerX centerY", x, y, centerX, centerY);

  if (x < centerX && y < centerY) return "q1"; // 重要-紧急
  if (x >= centerX && y < centerY) return "q2"; // 不重要-紧急
  if (x < centerX && y >= centerY) return "q3"; // 重要-不紧急
  return "q4"; // 不重要-不紧急
};

// 获取象限对应的任务数据
const getQuadrantTaskData = (quadrant: string) => {
  const data = {
    q1: { label: "重要且紧急任务", priority: "高" },
    q2: { label: "不重要但紧急任务", priority: "中" },
    q3: { label: "重要但不紧急任务", priority: "高" },
    q4: { label: "不重要不紧急任务", priority: "低" },
  };
  return data[quadrant as keyof typeof data];
};

export const TaskMatrix = () => {
  const flowContainerRef = useRef<HTMLDivElement>(null);
  const { getViewport, screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([
    // 重要-紧急（第一象限）
    {
      id: "1",
      type: "task",
      position: { x: 0, y: 0 },
      data: { label: "修复生产Bug", priority: "高" },
    },
    // 不重要-紧急（第二象限）
    {
      id: "2",
      type: "task",
      position: { x: 400, y: 100 },
      data: { label: "回复邮件", priority: "中" },
    },
    // 重要-不紧急（第三象限）
    {
      id: "3",
      type: "task",
      position: { x: 100, y: 300 },
      data: { label: "技术学习", priority: "高" },
    },
    // 不重要-不紧急（第四象限）
    {
      id: "4",
      type: "task",
      position: { x: 400, y: 300 },
      data: { label: "整理文档", priority: "低" },
    },
  ]);

  // 处理画布双击事件
  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      // 获取点击位置相对于画布的坐标
      const { x, y } = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // 获取视口信息
      const viewport = getViewport();
      console.log("viewport:", viewport);

      // 计算中心点坐标
      //   const centerX = -viewport.x / viewport.zoom;
      //   const centerY = -viewport.y / viewport.zoom;
      if (flowContainerRef.current) {
        const { width, height } =
          flowContainerRef.current.getBoundingClientRect();
        const centerX = width / 2;
        const centerY = height / 2;
        // 判断象限
        const quadrant = getQuadrant(x, y, centerX, centerY);
        const taskData = getQuadrantTaskData(quadrant);

        // 创建新节点
        const newNode = {
          id: `task-${Date.now()}`,
          type: "task",
          position: { x, y },
          data: taskData,
        };

        // 添加新节点
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [screenToFlowPosition, getViewport, setNodes]
  );

  return (
    <div className="w-full h-[calc(100vh-8rem)]" ref={flowContainerRef}>
      <ReactFlow
        className="border"
        nodes={nodes}
        onNodesChange={onNodesChange}
        onDoubleClick={onDoubleClick}
        panOnDrag={false}
        zoomOnDoubleClick={false}
        nodeTypes={nodeTypes}
        minZoom={1}
        maxZoom={1}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <QuadrantGrid />
        <Background gap={40} size={2} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
