import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1", className)}>
      {steps.map((step, i) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                  done && "bg-[var(--color-secondary)] text-white",
                  active && "bg-[var(--color-primary)] text-white shadow-[0_0_0_4px_var(--color-primary-soft)]",
                  !done && !active && "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]",
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step.id}
              </div>
              <span
                className={cn(
                  "text-sm",
                  active ? "inline font-semibold text-[var(--color-text)]" : "hidden sm:inline text-[var(--color-text-muted)]",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 w-6 sm:w-8 rounded-full transition-colors duration-300", done ? "bg-[var(--color-secondary)]" : "bg-[var(--color-border)]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
