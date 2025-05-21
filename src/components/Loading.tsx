import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function Loading({
  size = "md",
  variant = "default",
  className,
  text,
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-2",
    fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm",
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && <p className={cn("text-sm", variantClasses[variant])}>{text}</p>}
    </div>
  );
}

// 创建一个更复杂的加载组件，包含进度条
export function LoadingWithProgress({
  progress,
  text,
  className,
}: {
  progress: number;
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// 创建一个骨架屏加载组件
export function LoadingSkeleton({
  className,
  count = 3,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-12 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

// 创建一个脉冲加载组件
export function LoadingPulse({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-full bg-primary",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
