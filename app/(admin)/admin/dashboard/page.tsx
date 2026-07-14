"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard, SimpleStatCard } from "@/components/shared/StatCard";
import { DateRangePicker, type DateRange } from "@/components/shared/DateRangePicker";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/shared/StarRating";
import { t } from "@/lib/i18n";
import { formatVND } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { useAdminDashboardStats } from "@/hooks/useApi";
import {
  ClipboardList,
  Users,
  CheckCircle,
  UserCircle,
  Wallet,
  Loader2,
} from "lucide-react";
import type { FinancialBreakdown } from "@/types";

const STATUS_LABELS = [
  "PENDING",
  "ON_HOLD_PAYMENT",
  "CONFIRMED",
  "ACCEPTED",
  "IN_PROGRESS",
  "REVIEW_PENDING",
  "PAYMENT_PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;

interface TopCleaner {
  cleanerId: string;
  fullName: string;
  averageRating: number;
  totalOrders: number;
}

export default function AdminDashboardPage() {
  const [range, setRange] = useState<DateRange>({});
  const { data: stats, isLoading } = useAdminDashboardStats(range);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </div>
    );
  }

  const totalOrders = stats?.totalOrders ?? 0;
  const completedOrders = stats?.totalCompleted ?? 0;
  const activeCleaners = stats?.totalCleaners ?? 0;
  const totalCustomers = stats?.totalCustomers ?? 0;

  // When a date range is active the backend scopes the breakdown to it; with no
  // range we fall back to the all-time figures.
  const money: FinancialBreakdown | undefined =
    stats?.rangeBreakdown ?? stats?.breakdown?.allTime;

  const topCleaners: TopCleaner[] = stats?.topCleaners ?? [];

  const statusMap = Object.fromEntries(
    (stats?.ordersByStatus ?? []).map((item: any) => [item.status, item.count]),
  );
  const ordersByStatus = STATUS_LABELS.map((status) => ({
    status,
    count: statusMap[status] ?? 0,
  })).filter((item) => item.count > 0);

  return (
    <div>
      <PageHeader title={t("admin.dashboard.title")} />

      <DateRangePicker value={range} onChange={setRange} className="mb-6" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title={t("admin.dashboard.totalOrders")}
          value={totalOrders}
          icon={ClipboardList}
        />
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
        <StatCard
          title={t("admin.dashboard.totalCustomers")}
          value={totalCustomers}
          icon={UserCircle}
          accent="primary"
        />
      </div>

      {/* Money. `grossBilled` is what customers paid; only `commission` is ours
          to keep, so the two are never shown as the same number. */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t("admin.dashboard.grossBilled")}
          value={formatVND(money?.grossBilled ?? 0)}
          icon={Wallet}
          accent="primary"
        />
        <StatCard
          title={t("admin.dashboard.commission")}
          value={formatVND(money?.commission ?? 0)}
          icon={Wallet}
          accent="success"
          trend={
            money?.commission
              ? `${Math.round((money.commission / Math.max(money.serviceRevenue, 1)) * 100)}% doanh thu dịch vụ`
              : undefined
          }
        />
        <StatCard
          title={t("admin.dashboard.cleanerPayout")}
          value={formatVND(money?.cleanerPayout ?? 0)}
          icon={Users}
          accent="info"
        />
        <StatCard
          title={t("admin.dashboard.reimbursements")}
          value={formatVND(money?.reimbursements ?? 0)}
          icon={Wallet}
          accent="warning"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold mb-4">
            {t("admin.dashboard.revenueBreakdown")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <SimpleStatCard
              title={t("admin.dashboard.serviceRevenue")}
              value={formatVND(money?.serviceRevenue ?? 0)}
            />
            <SimpleStatCard
              title={t("admin.dashboard.reimbursements")}
              value={formatVND(money?.reimbursements ?? 0)}
            />
            <SimpleStatCard
              title={t("admin.dashboard.commission")}
              value={formatVND(money?.commission ?? 0)}
            />
            <SimpleStatCard
              title={t("admin.dashboard.completedOrders")}
              value={money?.orders ?? 0}
            />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-3">
            {t("admin.dashboard.reimbursementNote")}
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">
            {t("admin.dashboard.ordersByStatus")}
          </h2>
          <div className="space-y-2">
            {ordersByStatus.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                {t("common.noData")}
              </p>
            ) : (
              ordersByStatus.map((item) => (
                <div key={item.status} className="flex justify-between text-sm">
                  <span>{ORDER_STATUS_LABEL[item.status]}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-semibold mb-4">
          {t("admin.dashboard.topCleaners")}
        </h2>
        {topCleaners.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            {t("common.noData")}
          </p>
        ) : (
          topCleaners.map((c, i) => (
            <div
              key={c.cleanerId}
              className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
            >
              <span className="font-medium">
                {i + 1}. {c.fullName}
              </span>
              <div className="flex items-center gap-3">
                <StarRating value={c.averageRating} readonly size="sm" />
                <span className="text-[var(--color-text-muted)] text-sm tabular-nums">
                  {c.averageRating.toFixed(1)} · {c.totalOrders} đơn
                </span>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
