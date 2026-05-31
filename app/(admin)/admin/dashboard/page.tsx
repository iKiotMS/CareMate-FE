"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard, SimpleStatCard } from "@/components/shared/StatCard";
import { SimpleBarChart } from "@/components/shared/Charts";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { MOCK_DASHBOARD_STATS, MOCK_CHART_DATA, MOCK_CLEANERS, formatCurrency } from "@/data/mock";
import { ClipboardList, DollarSign, Users, CheckCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const s = MOCK_DASHBOARD_STATS;
  const topCleaners = [...MOCK_CLEANERS].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);

  return (
    <div>
      <PageHeader title={t("admin.dashboard.title")} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title={t("admin.dashboard.totalOrders")} value={s.totalOrders} icon={ClipboardList} />
        <StatCard title={t("admin.dashboard.revenue")} value={formatCurrency(s.revenue)} icon={DollarSign} accent="success" />
        <StatCard title={t("admin.dashboard.activeCleaners")} value={s.activeCleaners} icon={Users} accent="info" />
        <StatCard title={t("admin.dashboard.completedOrders")} value={s.completedOrders} icon={CheckCircle} accent="success" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.dashboard.ordersByDay")}</h2>
          <SimpleBarChart data={MOCK_CHART_DATA.ordersByDay} labelKey="day" valueKey="count" />
        </Card>
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.dashboard.ordersByStatus")}</h2>
          <div className="space-y-2">
            {MOCK_CHART_DATA.ordersByStatus.map((item) => (
              <div key={item.status} className="flex justify-between text-sm">
                <span>{item.status}</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.dashboard.topCleaners")}</h2>
          {topCleaners.map((c, i) => (
            <div key={c._id} className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
              <span>{i + 1}. {c.fullName}</span>
              <span className="text-[var(--color-warning)]">{c.rating}★</span>
            </div>
          ))}
        </Card>
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.dashboard.satisfaction")}</h2>
          <p className="text-4xl font-bold text-[var(--color-primary)]">{s.satisfaction}★</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">Trung bình từ {s.completedOrders} đơn hoàn thành</p>
        </Card>
      </div>
    </div>
  );
}
