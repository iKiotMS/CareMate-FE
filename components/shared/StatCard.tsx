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
  primary: "from-[var(--color-primary)]/[0.07] to-transparent border-[var(--color-primary)]/20",
  success: "from-[var(--color-success)]/[0.07] to-transparent border-[var(--color-success)]/20",
  warning: "from-[var(--color-warning)]/[0.07] to-transparent border-[var(--color-warning)]/20",
  info: "from-[var(--color-info)]/[0.07] to-transparent border-[var(--color-info)]/20",
};

const iconAccentMap = {
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
};

export function StatCard({ title, value, icon: Icon, trend, className, accent = "primary" }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border bg-gradient-to-br p-5 shadow-[var(--shadow-xs)] transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        accentMap[accent],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[var(--color-text-secondary)] truncate">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-[var(--color-text)] mt-1.5">{value}</p>
          {trend && <p className="text-xs font-medium text-[var(--color-success)] mt-1.5">{trend}</p>}
        </div>
        {Icon && (
          <div className={cn("shrink-0 rounded-[var(--radius-lg)] p-2.5", iconAccentMap[accent])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export function SimpleStatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs text-[var(--color-text-muted)]">{title}</p>
      <p className="text-xl font-bold tracking-tight text-[var(--color-text)] mt-1">{value}</p>
    </div>
  );
}
