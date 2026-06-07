"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StarDisplay } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { t } from "@/lib/i18n";
import { useMyReceivedReviews } from "@/hooks/useApi";

export default function CleanerReviewsPage() {
  const { data, isLoading, isError, refetch } = useMyReceivedReviews();
  const reviews = (data as any)?.data ?? [];

  return (
    <div>
      <PageHeader title={t("cleaner.reviews.title")} />
      <div className="space-y-4 max-w-2xl">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : reviews.length === 0 ? (
          <EmptyState message="Chưa có đánh giá nào." />
        ) : (
          reviews.map((r: any) => (
            <Card key={r._id}>
              <div className="flex justify-between">
                <p className="font-medium">{r.customerName}</p>
                <StarDisplay rating={r.rating} />
              </div>
              {r.comment && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">{r.comment}</p>
              )}
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                {new Date(r.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
