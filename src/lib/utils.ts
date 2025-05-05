import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 将分钟转换为小时和分钟显示
export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// 使用setTimeout模拟setTimeInterval
export const customSetTimeInterval = (callback: () => void, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  timer = setTimeout(() => {
    callback();
    customSetTimeInterval(callback, delay);
  }, delay);
  return () => clearTimeout(timer);
};
