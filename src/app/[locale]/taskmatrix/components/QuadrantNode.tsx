/* eslint-disable react/display-name */
import { memo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuadrantNodeProps {
  data: {
    title: string;
    description: string;
    color: string;
  };
}

export const QuadrantNode = memo(({ data }: QuadrantNodeProps) => {
  return (
    <Card className={cn("p-4 h-full", data.color)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{data.title}</h2>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
      </div>

      {/* 任务列表区域 */}
      <div className="space-y-2">{/* 这里可以放置任务节点 */}</div>
    </Card>
  );
});
