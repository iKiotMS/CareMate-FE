"use client";

import { useState } from "react";
import { useAdminRatingAnalytics, useAdminReviews } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterTabs } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { StarDisplay } from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";

const RATING_FILTERS = [
  { id: "all",    label: t("common.all") },
  { id: "low",    label: t("admin.reviews.low") },
  { id: "medium", label: t("admin.reviews.medium") },
  { id: "high",   label: t("admin.reviews.high") },
];

function filterToRange(filter: string) {
  if (filter === "low")    return { minRating: 1, maxRating: 2 };
  if (filter === "medium") return { minRating: 3, maxRating: 3 };
  if (filter === "high")   return { minRating: 4, maxRating: 5 };
  return {};
}

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState("all");
  const { data: analytics, isLoading: analyticsLoading } = useAdminRatingAnalytics();
  const { data: reviewsData, isLoading, isError, refetch } = useAdminReviews(filterToRange(filter));

  const reviews = (reviewsData as any)?.data ?? [];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title={t("admin.reviews.title")} />

      {/* Summary bar */}
      {!analyticsLoading && analytics && (
        <div className="flex items-center gap-6 p-4 rounded-xl bg-[var(--color-bg-muted)]">
          <div>
            <p className="text-3xl font-bold text-[var(--color-primary)]">
              {(analytics as any).overallAverage?.toFixed(1)}
            </p>
            <StarDisplay rating={(analytics as any).overallAverage ?? 0} />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-semibold text-[var(--color-text)]">{(analytics as any).totalReviews}</p>
              <p className="text-[var(--color-text-muted)]">Tổng đánh giá</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--color-success)]">
                {(analytics as any).distribution?.find((d: any) => d.stars === 5)?.percentage?.toFixed(1)}%
              </p>
              <p className="text-[var(--color-text-muted)]">5 sao</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--color-danger)]">
                {(analytics as any).lowRatingAlerts?.length ?? 0}
              </p>
              <p className="text-[var(--color-text-muted)]">Cảnh báo</p>
            </div>
          </div>
        </div>
      )}

      <FilterTabs tabs={RATING_FILTERS} active={filter} onChange={setFilter} />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <Card key={r._id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-[var(--color-text)]">
                    {r.customerName} <span className="text-[var(--color-text-muted)]">→</span> {r.cleanerName}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {r.rating <= 2 && <Badge variant="danger">Cần theo dõi</Badge>}
                  <StarDisplay rating={r.rating} />
                </div>
              </div>
              {r.comment && (
                <p className="text-sm mt-2 text-[var(--color-text-secondary)]">{r.comment}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
