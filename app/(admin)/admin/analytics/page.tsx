"use client";

import { useState } from "react";
import { useAdminRatingAnalytics, useAdminCleanerPerformance } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { SimpleStatCard } from "@/components/shared/StatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonStatCard, SkeletonTable } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FilterTabs } from "@/components/shared/EmptyState";
import { StarDisplay } from "@/components/shared/StarRating";
import { t } from "@/lib/i18n";

const SORT_TABS = [
  { id: "rating",         label: "Đánh giá" },
  { id: "completionRate", label: "Tỉ lệ hoàn thành" },
  { id: "totalOrders",    label: "Số đơn" },
];

export default function AdminAnalyticsPage() {
  const [sortBy, setSortBy] = useState<"rating" | "completionRate" | "totalOrders">("rating");

  const { data: ratings,  isLoading: loadingRatings,  isError: errRatings,  refetch: refetchRatings  } = useAdminRatingAnalytics();
  const { data: cleaners, isLoading: loadingCleaners, isError: errCleaners, refetch: refetchCleaners } = useAdminCleanerPerformance(sortBy);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title={t("admin.analytics.title")} />

      {/* Rating stats */}
      {errRatings ? (
        <ErrorState onRetry={refetchRatings} />
      ) : loadingRatings ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SimpleStatCard title="Đánh giá trung bình"   value={`${(ratings as any)?.overallAverage?.toFixed(1) ?? "—"}★`} />
          <SimpleStatCard title="Tổng lượt đánh giá"    value={(ratings as any)?.totalReviews ?? 0} />
          <SimpleStatCard title="Cảnh báo đánh giá thấp" value={(ratings as any)?.lowRatingAlerts?.length ?? 0} />
          <SimpleStatCard title="Tỉ lệ 5 sao"           value={`${(ratings as any)?.distribution?.find((d: any) => d.stars === 5)?.percentage?.toFixed(1) ?? 0}%`} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rating distribution */}
        <Card>
          <h2 className="font-semibold mb-4">Phân bổ đánh giá</h2>
          {loadingRatings ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-6 bg-[var(--color-bg-muted)] rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {((ratings as any)?.distribution ?? []).slice().reverse().map((d: any) => (
                <div key={d.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-10 text-right text-[var(--color-text-muted)]">{d.stars} ★</span>
                  <div className="flex-1 h-3 bg-[var(--color-bg-muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-warning)] rounded-full transition-all"
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-[var(--color-text-muted)]">{d.count} ({d.percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          )}

          {/* Low rating alerts */}
          {((ratings as any)?.lowRatingAlerts ?? []).length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <p className="text-sm font-medium text-[var(--color-danger)] mb-2">Cảnh báo đánh giá thấp</p>
              {(ratings as any).lowRatingAlerts.map((alert: any) => (
                <div key={alert.cleanerId} className="flex items-center justify-between text-sm py-1">
                  <span className="text-[var(--color-text)]">{alert.cleanerName}</span>
                  <Badge variant="danger">{alert.recentRating.toFixed(1)} ★</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Cleaner performance */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Hiệu suất nhân viên</h2>
          </div>
          <FilterTabs
            tabs={SORT_TABS}
            active={sortBy}
            onChange={(id) => setSortBy(id as typeof sortBy)}
            className="mb-4"
          />
          {errCleaners ? (
            <ErrorState onRetry={refetchCleaners} />
          ) : loadingCleaners ? (
            <SkeletonTable rows={3} />
          ) : (
            <div className="space-y-3">
              {((cleaners as any)?.data ?? []).map((c: any, i: number) => (
                <div key={c.cleanerId} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-muted)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[var(--color-text)] truncate">{c.cleanerName}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {c.completedOrders}/{c.totalOrders} đơn · Hoàn thành {c.completionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <StarDisplay rating={c.averageRating} />
                    <p className="text-xs text-[var(--color-text-muted)]">{c.totalReviews} đánh giá</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
