"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Calendar } from "lucide-react";

export interface DateRange {
  from?: string;
  to?: string;
}

/** Local `YYYY-MM-DD` — never `toISOString()`, which shifts to UTC and can land
 *  on the previous day for anyone east of Greenwich (i.e. all our users). */
function toKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toKey(d);
}

function startOfMonth(): string {
  const d = new Date();
  return toKey(new Date(d.getFullYear(), d.getMonth(), 1));
}

const PRESETS: { label: string; range: () => DateRange }[] = [
  { label: "Hôm nay", range: () => ({ from: toKey(new Date()), to: toKey(new Date()) }) },
  { label: "7 ngày", range: () => ({ from: daysAgo(6), to: toKey(new Date()) }) },
  { label: "30 ngày", range: () => ({ from: daysAgo(29), to: toKey(new Date()) }) },
  { label: "Tháng này", range: () => ({ from: startOfMonth(), to: toKey(new Date()) }) },
  { label: "Tất cả", range: () => ({}) },
];

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [custom, setCustom] = useState(false);

  const activePreset = PRESETS.find((p) => {
    const r = p.range();
    return r.from === value.from && r.to === value.to;
  });

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {PRESETS.map((preset) => {
        const isActive = !custom && activePreset?.label === preset.label;
        return (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setCustom(false);
              onChange(preset.range());
            }}
            className={cn(
              "px-3 py-1.5 text-sm rounded-[var(--radius-md)] border transition-colors",
              isActive
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]",
            )}
          >
            {preset.label}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => setCustom((c) => !c)}
        className={cn(
          "px-3 py-1.5 text-sm rounded-[var(--radius-md)] border inline-flex items-center gap-1.5 transition-colors",
          custom
            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
            : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]",
        )}
      >
        <Calendar className="w-4 h-4" />
        Tuỳ chọn
      </button>

      {custom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value.from ?? ""}
            max={value.to || undefined}
            onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
            className="px-2 py-1.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
          />
          <span className="text-[var(--color-text-muted)] text-sm">→</span>
          <input
            type="date"
            value={value.to ?? ""}
            min={value.from || undefined}
            onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
            className="px-2 py-1.5 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
          />
        </div>
      )}
    </div>
  );
}
