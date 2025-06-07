// src/app/[locale]/taskmatrix/components/Quadrant.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuadrantProps {
  title: string;
  description: string;
  className?: string;
}

export const Quadrant = ({ title, description, className }: QuadrantProps) => {
  return (
    <Card className={cn("p-4 relative", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button size="icon" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* 任务列表区域 */}
      <div className="space-y-2">
        {/* 示例任务 */}
        <div className="p-3 bg-background rounded-lg border">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300"
            />
            <div>
              <h3 className="font-medium">示例任务</h3>
              <p className="text-sm text-muted-foreground">
                这是一个示例任务描述
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
