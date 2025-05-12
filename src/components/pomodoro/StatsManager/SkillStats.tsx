"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
// import * as RechartsPrimitive from "recharts";

import { ChartTooltip } from "@/components/ui/chart";

import { Skill, TimerRecord } from "@/types/pomodoro";
import { formatTime } from "@/lib/utils";

interface SkillStatsProps {
  skills: Skill[];
  timerRecords: TimerRecord[];
}

// 定义数据项的类型
interface SkillChartData {
  name: string;
  value: number;
  color: string;
}

// 定义自定义 Tooltip 的 props 类型
type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: Array<{
    payload: SkillChartData;
    value: number;
  }>;
};

export function SkillStats({ skills, timerRecords }: SkillStatsProps) {
  // 计算每个技能的专注时间
  const skillDistribution: SkillChartData[] = skills
    .map((skill) => {
      const duration = timerRecords
        .filter(
          (record) =>
            record.type === "pomodoro" && record.skillIds?.includes(skill.id)
        )
        .reduce((sum, record) => sum + record.duration, 0);

      return {
        name: skill.name,
        value: duration,
        color: skill.color,
      };
    })
    .filter((item) => item.value > 0);

  // 自定义提示框
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatTime(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold">Skills Distribution</div>

      <div className="h-[400px]">
        {skillDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<CustomTooltip />} />
              <Pie
                data={skillDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={true}
              >
                {skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No focus time data available
          </div>
        )}
      </div>
    </div>
  );
}
