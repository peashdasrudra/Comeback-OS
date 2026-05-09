import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-primary text-bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-bg-primary hover:bg-secondary/90 shadow-lg shadow-secondary/20",
    ghost: "bg-transparent text-text hover:bg-bg-card border border-border",
    danger: "bg-red text-bg-primary hover:bg-red/90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-lg font-medium transition-all duration-200 btn-interactive",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;