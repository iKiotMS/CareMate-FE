"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { getCustomerOrders, formatDate } from "@/data/mock";
import { ClipboardList, CheckCircle, Star, Calendar, Sparkles } from "lucide-react";

export default function CustomerDashboardPage() {
  const orders = getCustomerOrders();
  const active = orders.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === "COMPLETED").length;
  const pendingReviews = orders.filter((o) => o.status === "REVIEW_PENDING").length;
  const upcoming = orders.filter((o) => ["PENDING", "ASSIGNED", "ACCEPTED"].includes(o.status)).slice(0, 3);

  return (
    <div>
      <PageHeader
        title={t("customer.dashboard.title")}
        subtitle={t("customer.dashboard.subtitle")}
        action={
          <Link href="/customer/book">
            <Button className="gap-2"><Sparkles className="w-4 h-4" />{t("customer.dashboard.quickBook")}</Button>
          </Link>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title={t("customer.dashboard.activeOrders")} value={active} icon={ClipboardList} accent="primary" />
        <StatCard title={t("customer.dashboard.completedOrders")} value={completed} icon={CheckCircle} accent="success" />
        <StatCard title={t("customer.dashboard.pendingReviews")} value={pendingReviews} icon={Star} accent="warning" />
        <StatCard title={t("customer.dashboard.upcomingSchedule")} value={upcoming.length} icon={Calendar} accent="info" />
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text)] mb-4">{t("customer.dashboard.upcomingSchedule")}</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">{t("common.noData")}</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((o) => (
              <Link key={o._id} href={`/customer/orders/${o._id}`} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] transition-colors">
                <div>
                  <p className="font-medium text-[var(--color-text)]">{o.address}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{formatDate(o.scheduledDate)} · {o.scheduledTime}</p>
                </div>
                <OrderStatusBadge status={o.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
