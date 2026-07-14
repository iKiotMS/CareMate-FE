"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import {
  DateRangePicker,
  type DateRange,
} from "@/components/shared/DateRangePicker";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { formatVND } from "@/lib/format";
import { useSalaryStats, useFinancialSummary } from "@/hooks/useApi";
import { Wallet, Users, Receipt, Loader2 } from "lucide-react";

export default function AdminPayrollPage() {
  const [range, setRange] = useState<DateRange>({});
  const { data: salaries, isLoading } = useSalaryStats(range);
  const { data: money } = useFinancialSummary(range);

  const rows = salaries ?? [];
  const totalPayout = rows.reduce((sum, r) => sum + r.netEarnings, 0);
  const totalReimbursements = rows.reduce((sum, r) => sum + r.reimbursements, 0);

  return (
    <div>
      <PageHeader title={t("admin.payroll.title")} />

      <DateRangePicker value={range} onChange={setRange} className="mb-6" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t("admin.payroll.totalPayout")}
          value={formatVND(totalPayout)}
          icon={Wallet}
          accent="info"
        />
        <StatCard
          title={t("admin.dashboard.commission")}
          value={formatVND(money?.commission ?? 0)}
          icon={Wallet}
          accent="success"
        />
        <StatCard
          title={t("admin.payroll.reimbursements")}
          value={formatVND(totalReimbursements)}
          icon={Receipt}
          accent="warning"
        />
        <StatCard
          title={t("admin.payroll.cleanersPaid")}
          value={rows.length}
          icon={Users}
          accent="primary"
        />
      </div>

      <Card>
        <h2 className="font-semibold mb-1">{t("admin.payroll.table")}</h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          {t("admin.payroll.note")}
        </p>

        {isLoading ? (
          <div className="flex items-center gap-2 py-8">
            <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] py-6">
            {t("common.noData")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                  <th className="py-2 pr-4 font-medium">
                    {t("admin.payroll.cleaner")}
                  </th>
                  <th className="py-2 px-4 font-medium text-right">
                    {t("admin.payroll.orders")}
                  </th>
                  <th className="py-2 px-4 font-medium text-right">
                    {t("admin.payroll.serviceEarnings")}
                  </th>
                  <th className="py-2 px-4 font-medium text-right">
                    {t("admin.payroll.reimbursements")}
                  </th>
                  <th className="py-2 pl-4 font-medium text-right">
                    {t("admin.payroll.netEarnings")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.cleanerId}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="py-2.5 pr-4">
                      <p className="font-medium">{r.fullName}</p>
                      {r.phone && (
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {r.phone}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {r.totalOrders}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {formatVND(r.serviceEarnings)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-[var(--color-text-secondary)]">
                      {r.reimbursements > 0
                        ? formatVND(r.reimbursements)
                        : "—"}
                    </td>
                    <td className="py-2.5 pl-4 text-right tabular-nums font-semibold">
                      {formatVND(r.netEarnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--color-border-strong)]">
                  <td className="py-2.5 pr-4 font-semibold">
                    {t("admin.payroll.total")}
                  </td>
                  <td />
                  <td />
                  <td className="py-2.5 px-4 text-right tabular-nums">
                    {formatVND(totalReimbursements)}
                  </td>
                  <td className="py-2.5 pl-4 text-right tabular-nums font-bold">
                    {formatVND(totalPayout)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
