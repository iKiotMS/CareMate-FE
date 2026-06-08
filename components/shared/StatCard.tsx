import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
  accent?: "primary" | "success" | "warning" | "info";
}

const accentMap = {
  primary: "from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20",
  success: "from-[var(--color-success)]/10 to-transparent border-[var(--color-success)]/20",
  warning: "from-[var(--color-warning)]/10 to-transparent border-[var(--color-warning)]/20",
  info: "from-[var(--color-info)]/10 to-transparent border-[var(--color-info)]/20",
};

export function StatCard({ title, value, icon: Icon, trend, className, accent = "primary" }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border bg-gradient-to-br p-5 shadow-[var(--shadow-sm)]",
        accentMap[accent],
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{value}</p>
          {trend && <p className="text-xs text-[var(--color-success)] mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)]">
            <Icon className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
        )}
      </div>
    </div>
  );
}

export function SimpleStatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs text-[var(--color-text-muted)]">{title}</p>
      <p className="text-xl font-bold text-[var(--color-text)] mt-0.5">{value}</p>
    </div>
  );
}
