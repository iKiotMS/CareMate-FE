"use client";

import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

export interface TimelineItem {
  key: string;
  label: string;
  date?: string;
  done: boolean;
  active?: boolean;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={item.key} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2",
                item.done
                  ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                  : item.active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-muted)]",
              )}
            >
              {item.done && <Check className="w-4 h-4" />}
            </div>
            {i < items.length - 1 && (
              <div className={cn("w-0.5 flex-1 min-h-[24px] my-1", item.done ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]")} />
            )}
          </div>
          <div className="pb-6">
            <p className={cn("font-medium text-sm", item.done || item.active ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]")}>
              {item.label}
            </p>
            {item.date && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
