"use client";

import { cn } from "@/lib/cn";

export function SimpleBarChart({ data, labelKey, valueKey, formatValue }: {
  data: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item, i) => {
        const val = Number(item[valueKey]);
        const height = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-[var(--color-text-muted)]">
              {formatValue ? formatValue(val) : val}
            </span>
            <div
              className="w-full rounded-t-[var(--radius-sm)] bg-[var(--color-primary)] transition-all"
              style={{ height: `${Math.max(height, 4)}%` }}
            />
            <span className="text-xs text-[var(--color-text-secondary)]">{String(item[labelKey])}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ProgressBar({ value, max = 100, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {label && <div className="flex justify-between text-sm mb-1"><span>{label}</span><span>{pct.toFixed(0)}%</span></div>}
      <div className="h-2 rounded-full bg-[var(--color-bg-muted)] overflow-hidden">
        <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PhotoGrid({ photos, placeholder = "📷" }: { photos?: string[]; placeholder?: string }) {
  if (!photos?.length) {
    return <div className="text-sm text-[var(--color-text-muted)]">{placeholder} Chưa có ảnh</div>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {photos.map((_, i) => (
        <div key={i} className="aspect-video rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex items-center justify-center text-2xl">
          {placeholder}
        </div>
      ))}
    </div>
  );
}
