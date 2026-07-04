"use client";

import { cn } from "@/lib/cn";
import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-muted)]">
        <Inbox className="h-7 w-7 text-[var(--color-text-muted)]" />
      </div>
      <p className="font-semibold text-[var(--color-text)]">{title}</p>
      {description && <p className="text-sm text-[var(--color-text-muted)] mt-1.5 max-w-xs">{description}</p>}
    </div>
  );
}

interface FilterTabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function FilterTabs({ tabs, active, onChange, className }: FilterTabsProps) {
  return (
    <div className={cn("flex flex-nowrap gap-2 overflow-x-auto no-scrollbar", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-150",
            active === tab.id
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
