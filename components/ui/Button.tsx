import { cn } from "@/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-md)] active:scale-[0.98] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary)] text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_12px_-2px_var(--color-primary-soft)] hover:bg-[var(--color-primary-hover)] hover:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_20px_-4px_var(--color-primary-soft)]",
        secondary: "bg-[var(--color-secondary-soft)] text-[var(--color-secondary)] hover:brightness-95",
        outline: "border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-text-muted)]",
        ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]",
        danger: "bg-[var(--color-danger)] text-white shadow-sm hover:brightness-95",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-7 text-base",
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
