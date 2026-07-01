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
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-2", className)}>
      {steps.map((step, i) => {
        const done = step.id < currentStep;
        const active = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  done && "bg-[var(--color-success)] text-white",
                  active && "bg-[var(--color-primary)] text-white",
                  !done && !active && "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]",
                )}
              >
                {done ? "✓" : step.id}
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
              <div className={cn("w-8 h-0.5", done ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
