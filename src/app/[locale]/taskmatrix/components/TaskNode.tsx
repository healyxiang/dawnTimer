// src/app/[locale]/taskmatrix/components/TaskNode.tsx
// import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";

interface TaskNodeProps {
  data: {
    title: string;
    description?: string;
    completed: boolean;
  };
}

export const TaskNode = ({ data }: TaskNodeProps) => {
  return (
    <Card className="p-3 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-start gap-2">
        {/* <Checkbox
          checked={data.completed}
          onCheckedChange={(checked) => {
            // 处理任务完成状态变更
          }}
        /> */}
        <div>
          <h3 className="font-medium">{data.title}</h3>
          {data.description && (
            <p className="text-sm text-muted-foreground">{data.description}</p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};
