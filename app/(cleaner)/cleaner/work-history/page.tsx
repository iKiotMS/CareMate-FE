"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StarDisplay } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { getCleanerCompletedOrders, formatDate } from "@/data/mock";

export default function WorkHistoryPage() {
  const orders = getCleanerCompletedOrders();

  return (
    <div>
      <PageHeader title={t("cleaner.workHistory.title")} />
      <div className="space-y-3">
        {orders.map((o) => (
          <Card key={o._id}>
            <p className="font-medium">{o.address}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{formatDate(o.scheduledDate)}</p>
            {o.rating && <div className="mt-2"><StarDisplay rating={o.rating} /></div>}
          </Card>
        ))}
        {orders.length === 0 && <p className="text-[var(--color-text-muted)]">{t("common.noData")}</p>}
      </div>
    </div>
  );
}
