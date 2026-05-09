import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "neon";
  hover?: boolean;
}

export const Card = ({
  variant = "default",
  hover = true,
  className,
  children,
  ...props
}: CardProps) => {
  const variants = {
    default: "bg-bg-card border border-border",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    neon: "bg-bg-card border-2 border-primary/30 shadow-lg shadow-primary/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        "rounded-2xl p-4 transition-all duration-300",
        variants[variant],
        hover && "hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;