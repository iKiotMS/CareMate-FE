"use client";

import { cn } from "@/lib/cn";
import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="w-12 h-12 text-[var(--color-text-muted)] mb-4" />
      <p className="font-medium text-[var(--color-text)]">{title}</p>
      {description && <p className="text-sm text-[var(--color-text-muted)] mt-1">{description}</p>}
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
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            active === tab.id
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
