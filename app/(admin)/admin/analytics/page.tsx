"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SimpleStatCard } from "@/components/shared/StatCard";
import { SimpleBarChart } from "@/components/shared/Charts";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { MOCK_CHART_DATA, MOCK_DASHBOARD_STATS, formatCurrency } from "@/data/mock";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader title={t("admin.analytics.title")} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SimpleStatCard title={t("admin.analytics.avgRating")} value={`${MOCK_DASHBOARD_STATS.satisfaction}★`} />
        <SimpleStatCard title={t("admin.analytics.cancellationRate")} value="10.4%" />
        <SimpleStatCard title={t("admin.analytics.returningCustomers")} value="68%" />
        <SimpleStatCard title={t("admin.analytics.orderFrequency")} value="2.3/tháng" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.analytics.revenueByDay")}</h2>
          <SimpleBarChart data={MOCK_CHART_DATA.revenueByDay} labelKey="day" valueKey="amount" formatValue={(v) => `${(v / 1e6).toFixed(1)}M`} />
        </Card>
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.analytics.topCleaners")}</h2>
          {["Trần Văn Hùng — 156 việc", "Nguyễn Thị Lan — 89 việc", "Trần Minh Đức — 45 việc"].map((line) => (
            <p key={line} className="text-sm py-2 border-b border-[var(--color-border)] last:border-0">{line}</p>
          ))}
        </Card>
      </div>
    </div>
  );
}
