import { cn } from "../lib/utils";

interface SkeletonProps {
  variant?: "text" | "rect" | "avatar";
  lines?: number;
  className?: string;
}

export const Skeleton = ({
  variant = "text",
  lines = 1,
  className,
}: SkeletonProps) => {
  if (variant === "avatar") {
    return (
      <div className={cn("h-10 w-10 rounded-full bg-bg-surface animate-pulse", className)} />
    );
  }

  if (variant === "rect") {
    return (
      <div className={cn("h-20 w-full rounded-lg bg-bg-surface animate-pulse", className)} />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded bg-bg-surface animate-pulse",
            i === 0 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
};

export default Skeleton;