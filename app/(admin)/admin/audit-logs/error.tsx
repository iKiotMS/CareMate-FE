"use client";

import { ErrorState } from "@/components/shared/ErrorState";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorState message={error.message} onRetry={reset} />;
}
