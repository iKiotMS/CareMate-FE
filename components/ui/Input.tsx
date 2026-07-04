import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-focus)] hover:border-[var(--color-border-strong)] disabled:opacity-50 disabled:pointer-events-none";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(fieldBase, "h-11 px-3.5 text-[15px]", className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, "min-h-[100px] px-3.5 py-2.5 text-[15px] resize-y", className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(fieldBase, "h-11 px-3.5 text-[15px]", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-[var(--color-text)] mb-1.5", className)}
      {...props}
    />
  );
}

export function FormField({ label, children, className, required }: { label: string; children: React.ReactNode; className?: string; required?: boolean }) {
  return (
    <div className={cn("mb-4", className)}>
      <Label>
        {label}
        {required && <span className="ml-0.5 text-[var(--color-danger)]">*</span>}
      </Label>
      {children}
    </div>
  );
}
