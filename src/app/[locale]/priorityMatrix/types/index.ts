export interface Task {
  id: string;
  title: string;
  description?: string;
  quadrant: Quadrant;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type Quadrant =
  | "urgent-important"
  | "not-urgent-important"
  | "urgent-not-important"
  | "not-urgent-not-important";

export type Priority = "high" | "medium" | "low";

export interface QuadrantStats {
  total: number;
  completed: number;
  pending: number;
}

export interface QuadrantData {
  id: Quadrant;
  title: string;
  description: string;
  color: string;
  tasks: Task[];
  stats: QuadrantStats;
}

export interface QuadrantNode {
  id: string;
  type: "quadrant";
  position: { x: number; y: number };
  data: {
    quadrant: Quadrant;
    title: string;
    description: string;
    // tasks: Task[];
  };
}

export interface TaskNode {
  id: string;
  type: "task";
  position: { x: number; y: number };
  data: Task;
}
