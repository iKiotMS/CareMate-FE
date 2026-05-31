"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StarRating, StarDisplay } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { getCustomerOrders, formatDate } from "@/data/mock";

export default function CustomerReviewsPage() {
  const pending = getCustomerOrders().filter((o) => o.status === "REVIEW_PENDING");
  const reviewed = getCustomerOrders().filter((o) => o.rating);

  return (
    <div>
      <PageHeader title={t("customer.reviews.title")} subtitle={t("customer.reviews.subtitle")} />

      {pending.length > 0 && (
        <Card className="mb-6 border-[var(--color-warning)]/30">
          <h2 className="font-semibold text-[var(--color-text)] mb-4">{t("customer.reviews.pendingTitle")}</h2>
          <div className="space-y-3">
            {pending.map((o) => (
              <div key={o._id} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)]">
                <div>
                  <p className="font-medium">{o.address}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{formatDate(o.scheduledDate)}</p>
                </div>
                <Link href={`/customer/orders/${o._id}`}>
                  <Button size="sm">{t("customer.orderDetail.writeReview")}</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {reviewed.map((o) => (
          <Card key={o._id}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{o.address}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{formatDate(o.scheduledDate)} · {o.cleanerName}</p>
              </div>
              <StarDisplay rating={o.rating!} />
            </div>
            {o.review && <p className="text-sm text-[var(--color-text-secondary)] mt-3">{o.review}</p>}
          </Card>
        ))}
        {reviewed.length === 0 && pending.length === 0 && (
          <p className="text-center text-[var(--color-text-muted)] py-8">{t("common.noData")}</p>
        )}
      </div>
    </div>
  );
}
