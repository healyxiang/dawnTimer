/* eslint-disable react/display-name */
// src/app/[locale]/taskmatrix/components/AxisNode.tsx
import { memo } from "react";
// import { Handle, Position } from "@xyflow/react";

export const AxisNode = memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* X轴 */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
      {/* Y轴 */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />

      {/* X轴标签 */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
        不重要
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
        重要
      </div>

      {/* Y轴标签 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 text-2xl text-muted-foreground">
        紧急
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 text-2xl text-muted-foreground">
        不紧急
      </div>
    </div>
  );
});
