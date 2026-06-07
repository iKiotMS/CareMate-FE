"use client";

import { useState } from "react";
import { useMyIncomeSummary, useMyIncomeByOrder, useMyRatingAnalytics, useMyReceivedReviews } from "@/hooks/useApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { SimpleStatCard } from "@/components/shared/StatCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonStatCard, SkeletonCard } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { StarDisplay } from "@/components/shared/StarRating";
import { cn } from "@/lib/cn";

const PERIODS = [
  { id: "daily",   label: "Hôm nay" },
  { id: "weekly",  label: "Tuần này" },
  { id: "monthly", label: "Tháng này" },
  { id: "all",     label: "Tất cả" },
] as const;

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function EarningsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "all">("monthly");

  const { data: summary, isLoading: loadingSummary, isError: errSummary, refetch: refetchSummary } = useMyIncomeSummary(period);
  const { data: orders,  isLoading: loadingOrders  } = useMyIncomeByOrder({ page: 1 });
  const { data: ratings, isLoading: loadingRatings } = useMyRatingAnalytics();
  const { data: reviews, isLoading: loadingReviews } = useMyReceivedReviews(1, 5);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Thu nhập & Đánh giá" />

      {/* Period selector */}
      <div className="flex gap-2 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              period === p.id
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      {errSummary ? (
        <ErrorState onRetry={refetchSummary} />
      ) : loadingSummary ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SimpleStatCard title="Doanh thu (sau hoa hồng)" value={formatVND(summary?.totalNet ?? 0)} />
          <SimpleStatCard title="Doanh thu tổng"           value={formatVND(summary?.totalGross ?? 0)} />
          <SimpleStatCard title="Hoa hồng nền tảng"        value={formatVND(summary?.totalCommission ?? 0)} />
          <SimpleStatCard title="Số đơn hoàn thành"        value={summary?.ordersCount ?? 0} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income by order table */}
        <Card>
          <h2 className="font-semibold mb-4">Chi tiết theo đơn</h2>
          {loadingOrders ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 rounded animate-pulse bg-[var(--color-bg-muted)]" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[var(--color-text-muted)]">
                  <tr>
                    <th className="text-left py-2">Đơn</th>
                    <th className="text-right py-2">Tổng</th>
                    <th className="text-right py-2">Hoa hồng</th>
                    <th className="text-right py-2 text-[var(--color-success)]">Nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {((orders as any)?.data ?? []).map((o: any) => (
                    <tr key={o.orderId}>
                      <td className="py-2 font-mono text-xs text-[var(--color-text-muted)]">
                        #{o.orderId.slice(-6).toUpperCase()}
                        <span className="block text-[var(--color-text-secondary)] font-sans font-normal">{o.scheduledDate}</span>
                      </td>
                      <td className="py-2 text-right">{formatVND(o.grossAmount)}</td>
                      <td className="py-2 text-right text-[var(--color-danger)]">-{formatVND(o.commission)}</td>
                      <td className="py-2 text-right font-medium text-[var(--color-success)]">{formatVND(o.netAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Rating analytics */}
        <div className="space-y-4">
          <Card>
            <h2 className="font-semibold mb-4">Tổng quan đánh giá</h2>
            {loadingRatings ? (
              <SkeletonStatCard />
            ) : (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[var(--color-primary)]">
                    {(ratings as any)?.averageRating?.toFixed(1) ?? "—"}
                  </p>
                  <StarDisplay rating={(ratings as any)?.averageRating ?? 0} />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {(ratings as any)?.totalReviews ?? 0} đánh giá
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  {((ratings as any)?.distribution ?? []).slice().reverse().map((d: any) => (
                    <div key={d.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-6 text-right text-[var(--color-text-muted)]">{d.stars}★</span>
                      <div className="flex-1 h-2 bg-[var(--color-bg-muted)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-warning)] rounded-full"
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-[var(--color-text-muted)]">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-semibold mb-3">Đánh giá gần đây</h2>
            {loadingReviews ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {((reviews as any)?.data ?? []).map((r: any) => (
                  <div key={r._id} className="border-b border-[var(--color-border)] pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[var(--color-text)]">{r.customerName}</p>
                      <StarDisplay rating={r.rating} />
                    </div>
                    {r.comment && (
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
