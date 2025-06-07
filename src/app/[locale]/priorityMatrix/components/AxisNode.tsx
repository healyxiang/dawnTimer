/* eslint-disable react/display-name */
import { memo } from "react";

export const AxisNode = memo(
  ({
    data,
  }: {
    data: { direction: string; color: string; width: number; height: number };
  }) => {
    const { direction, color } = data;

    return (
      <div style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
        {direction === "horizontal" ? (
          // X 轴
          <div
            style={{
              borderTop: `2px solid ${color}`,
              width: "100%",
              position: "absolute",
              top: "50%",
            }}
          />
        ) : (
          // Y 轴
          <div
            style={{
              borderLeft: `2px solid ${color}`,
              height: "100%",
              position: "absolute",
              left: "50%",
            }}
          />
        )}
      </div>
    );
  }
);
