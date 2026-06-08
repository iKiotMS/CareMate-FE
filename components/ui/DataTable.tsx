import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export function DataTable({ headers, children, className }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-bg-muted)] border-b border-[var(--color-border)]">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 font-semibold text-[var(--color-text-secondary)] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn("hover:bg-[var(--color-surface-hover)] transition-colors", className)}>{children}</tr>;
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-[var(--color-text)]", className)}>{children}</td>;
}
