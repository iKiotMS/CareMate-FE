"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <AlertCircle className="h-12 w-12 text-[var(--color-danger)]" />
      <p className="text-[var(--color-text)]">
        {message ?? "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
