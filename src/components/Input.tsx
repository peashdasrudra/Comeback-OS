import { cn } from "../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export const Input = ({
  label,
  error = false,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          error ? "border-red" : "border-border",
          "bg-bg-card text-text-primary placeholder:text-text-muted",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;