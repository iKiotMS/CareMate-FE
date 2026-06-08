import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ className, hover, padding = "md", children, ...props }: CardProps) {
  const paddingClass = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  }[padding];

  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]",
        hover && "transition-shadow hover:shadow-[var(--shadow-md)]",
        paddingClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-[var(--color-text)]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[var(--color-text-secondary)]", className)} {...props} />;
}
