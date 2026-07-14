import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 mb-6 animate-fade-up sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-stretch gap-3">
        {/* Thanh nhấn thương hiệu — đồng bộ với landing */}
        <span
          aria-hidden
          className="mt-1 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[var(--color-gradient-from)] to-[var(--color-gradient-to)]"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">{title}</h1>
          {subtitle && <p className="text-[var(--color-text-secondary)] mt-1.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
