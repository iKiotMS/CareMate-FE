"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SimpleStatCard } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { MOCK_EARNINGS, formatCurrency } from "@/data/mock";
import { SimpleBarChart } from "@/components/shared/Charts";

const weeklyData = [
  { day: "T2", amount: 180000 },
  { day: "T3", amount: 220000 },
  { day: "T4", amount: 150000 },
  { day: "T5", amount: 280000 },
  { day: "T6", amount: 200000 },
  { day: "T7", amount: 120000 },
  { day: "CN", amount: 100000 },
];

export default function EarningsPage() {
  const e = MOCK_EARNINGS;
  return (
    <div>
      <PageHeader title={t("cleaner.earnings.title")} />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <SimpleStatCard title={t("cleaner.earnings.thisWeek")} value={formatCurrency(e.thisWeek)} />
        <SimpleStatCard title={t("cleaner.earnings.thisMonth")} value={formatCurrency(e.thisMonth)} />
        <SimpleStatCard title={t("cleaner.earnings.totalJobs")} value={e.totalJobs} />
      </div>
      <Card>
        <h2 className="font-semibold mb-4">Thu nhập tuần này</h2>
        <SimpleBarChart data={weeklyData} labelKey="day" valueKey="amount" formatValue={(v) => `${(v / 1000).toFixed(0)}k`} />
      </Card>
    </div>
  );
}
