import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)]",
        "bg-[var(--color-bg-elevated)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[100px] px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)]",
        "bg-[var(--color-bg-elevated)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-y",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)]",
        "bg-[var(--color-bg-elevated)] text-[var(--color-text)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
        className,
      )}
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
