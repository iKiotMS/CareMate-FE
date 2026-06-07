import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--color-bg-muted)]",
        className,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-2">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  );
}
