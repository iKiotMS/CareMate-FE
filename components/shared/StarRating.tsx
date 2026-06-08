"use client";

import { cn } from "@/lib/cn";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

export function StarRating({ value, onChange, readonly, size = "md" }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(!readonly && "cursor-pointer hover:scale-110 transition-transform")}
        >
          <Star
            className={cn(
              sizeMap[size],
              star <= value ? "fill-[var(--color-warning)] text-[var(--color-warning)]" : "text-[var(--color-border-strong)]",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({ rating }: { rating: number }) {
  return <StarRating value={rating} readonly size="sm" />;
}
