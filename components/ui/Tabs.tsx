"use client";

import { cn } from "@/lib/cn";
import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  const current = tabs.find((t) => t.id === active);

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-[var(--color-border)] mb-5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
              active === tab.id
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
            )}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]" />
            )}
          </button>
        ))}
      </div>
      <div>{current?.content}</div>
    </div>
  );
}
