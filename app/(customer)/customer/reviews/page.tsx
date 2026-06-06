"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StarDisplay } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { useCustomerOrders } from "@/hooks/useApi";
import { formatOrderDate } from "@/lib/format";
import type { Order } from "@/types";
import { Loader2 } from "lucide-react";

export default function CustomerReviewsPage() {
  const { data: ordersRaw, isLoading } = useCustomerOrders();
  const list = (Array.isArray(ordersRaw) ? ordersRaw : []) as Order[];

  const pending = list.filter((o) => o.status === "REVIEW_PENDING" && o.rating == null);
  const reviewed = list.filter((o) => o.rating != null);

  return (
    <div>
      <PageHeader title={t("customer.reviews.title")} subtitle={t("customer.reviews.subtitle")} />

      {isLoading ? (
        <p className="flex items-center gap-2 py-8">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </p>
      ) : (
        <>
          {pending.length > 0 && (
            <Card className="mb-6 border-[var(--color-warning)]/30">
              <h2 className="font-semibold text-[var(--color-text)] mb-4">
                {t("customer.reviews.pendingTitle")}
              </h2>
              <div className="space-y-3">
                {pending.map((o) => (
                  <div
                    key={o._id}
                    className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)]"
                  >
                    <div>
                      <p className="font-medium">{o.address}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {formatOrderDate(o.scheduledDate)}
                      </p>
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
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {formatOrderDate(o.scheduledDate)}
                    </p>
                  </div>
                  <StarDisplay rating={o.rating!} />
                </div>
                {o.review && (
                  <p className="text-sm text-[var(--color-text-secondary)] mt-3">{o.review}</p>
                )}
              </Card>
            ))}
            {reviewed.length === 0 && pending.length === 0 && (
              <p className="text-center text-[var(--color-text-muted)] py-8">{t("common.noData")}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
