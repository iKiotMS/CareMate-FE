import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-md)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm",
        secondary: "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)] hover:opacity-90",
        outline: "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]",
        ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
        danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ className, variant, size, loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
