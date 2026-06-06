"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { useAdminDashboardStats, useAdminCleaners } from "@/hooks/useApi";
import { ClipboardList, Users, CheckCircle, UserCircle, Loader2 } from "lucide-react";
import type { User } from "@/types";

const STATUS_LABELS = [
  "PENDING",
  "ASSIGNED",
  "ACCEPTED",
  "IN_PROGRESS",
  "REVIEW_PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminDashboardStats();
  const { data: cleanersData } = useAdminCleaners(undefined, 1);

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </p>
    );
  }

  const s = stats as Record<string, number> | undefined;
  const totalOrders = s?.total ?? 0;
  const completedOrders = s?.COMPLETED ?? 0;
  const activeCleaners = s?.totalCleaners ?? 0;
  const totalCustomers = s?.totalCustomers ?? 0;

  const cleaners = ((cleanersData as { cleaners?: User[] })?.cleaners ?? []) as User[];
  const topCleaners = [...cleaners].slice(0, 3);

  const ordersByStatus = STATUS_LABELS.map((status) => ({
    status,
    count: s?.[status] ?? 0,
  })).filter((item) => item.count > 0);

  return (
    <div>
      <PageHeader title={t("admin.dashboard.title")} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t("admin.dashboard.totalOrders")} value={totalOrders} icon={ClipboardList} />
        <StatCard
          title={t("admin.dashboard.completedOrders")}
          value={completedOrders}
          icon={CheckCircle}
          accent="success"
        />
        <StatCard
          title={t("admin.dashboard.activeCleaners")}
          value={activeCleaners}
          icon={Users}
          accent="info"
        />
        <StatCard title="Khách hàng" value={totalCustomers} icon={UserCircle} accent="primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.dashboard.ordersByStatus")}</h2>
          <div className="space-y-2">
            {ordersByStatus.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">{t("common.noData")}</p>
            ) : (
              ordersByStatus.map((item) => (
                <div key={item.status} className="flex justify-between text-sm">
                  <span>{item.status}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.dashboard.topCleaners")}</h2>
          {topCleaners.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">{t("common.noData")}</p>
          ) : (
            topCleaners.map((c, i) => (
              <div
                key={c._id}
                className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0"
              >
                <span>
                  {i + 1}. {c.fullName}
                </span>
                <span className="text-[var(--color-text-muted)] text-sm">{c.email}</span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
