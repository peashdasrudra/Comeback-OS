import { cn } from "../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-bg-surface text-text-secondary",
  success: "bg-primary/20 text-primary border border-primary/30",
  warning: "bg-gold/20 text-gold border border-gold/30",
  danger: "bg-red/20 text-red border border-red/30",
  info: "bg-secondary/20 text-secondary border border-secondary/30",
};

export const Badge = ({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;