import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-[var(--accent)] text-black font-bold hover:opacity-90 glow",
      secondary: "bg-[var(--muted)] text-white border border-[var(--border)] hover:border-[var(--accent-30)] hover:text-[var(--accent)]",
      ghost: "text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--muted)]",
      danger: "bg-red-950/50 text-red-400 border border-red-900/50 hover:bg-red-900/50",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-lg",
      md: "px-5 py-2.5 text-sm rounded-xl",
      lg: "px-8 py-3.5 text-base rounded-xl",
    };
    return (
      <button ref={ref} disabled={disabled || loading}
        className={cn("inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed", variants[variant], sizes[size], className)}
        {...props}>
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
