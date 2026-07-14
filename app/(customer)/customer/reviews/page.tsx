"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StarDisplay } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/lib/i18n";
import { useCustomerOrders } from "@/hooks/useApi";
import { formatOrderDate } from "@/lib/format";
import type { Order } from "@/types";

export default function CustomerReviewsPage() {
  const { data: ordersRaw, isLoading } = useCustomerOrders();
  const list = (Array.isArray(ordersRaw) ? ordersRaw : []) as Order[];

  const pending = list.filter((o) => o.status === "REVIEW_PENDING" && o.rating == null);
  const reviewed = list.filter((o) => o.rating != null);

  return (
    <div>
      <PageHeader title={t("customer.reviews.title")} subtitle={t("customer.reviews.subtitle")} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-[var(--radius-xl)]" />
          ))}
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <Card className="mb-6 border-[var(--color-warning)]/25 bg-[var(--color-warning-soft)] animate-fade-up">
              <h2 className="font-semibold text-[var(--color-text)] mb-4">
                {t("customer.reviews.pendingTitle")}
              </h2>
              <div className="space-y-3">
                {pending.map((o) => (
                  <div
                    key={o._id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-text)] truncate">{o.address}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {formatOrderDate(o.scheduledDate)}
                      </p>
                    </div>
                    <Link href={`/customer/orders/${o._id}`} className="shrink-0">
                      <Button size="sm">{t("customer.orderDetail.writeReview")}</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="space-y-3.5 animate-fade-up">
            {reviewed.map((o) => (
              <Card key={o._id} hover>
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text)] truncate">{o.address}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {formatOrderDate(o.scheduledDate)}
                    </p>
                  </div>
                  <StarDisplay rating={o.rating!} />
                </div>
                {o.review && (
                  <p className="text-sm text-[var(--color-text-secondary)] mt-3 leading-relaxed">{o.review}</p>
                )}
              </Card>
            ))}
            {reviewed.length === 0 && pending.length === 0 && (
              <EmptyState title={t("common.noData")} description="Đánh giá của bạn sẽ hiển thị tại đây sau khi hoàn thành dịch vụ." />
            )}
          </div>
        </>
      )}
    </div>
  );
}
