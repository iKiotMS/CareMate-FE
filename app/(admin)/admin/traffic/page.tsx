"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard, SimpleStatCard } from "@/components/shared/StatCard";
import {
  DateRangePicker,
  type DateRange,
} from "@/components/shared/DateRangePicker";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { useTrafficStats } from "@/hooks/useApi";
import { Eye, Users, LogIn, UserPlus, Loader2 } from "lucide-react";

const PAGE_LABEL: Record<string, string> = {
  landing: "Trang giới thiệu (landing)",
  home: "Trang chủ khách hàng",
};

const FAILURE_LABEL: Record<string, string> = {
  not_found: "Số điện thoại không tồn tại",
  inactive: "Tài khoản bị khoá",
  bad_password: "Sai mật khẩu",
};

export default function AdminTrafficPage() {
  const [range, setRange] = useState<DateRange>({});
  const { data: stats, isLoading } = useTrafficStats(range);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </div>
    );
  }

  const totalFailed = (stats?.logins.failed ?? []).reduce(
    (sum, f) => sum + f.count,
    0,
  );
  const peakViews = Math.max(1, ...(stats?.daily ?? []).map((d) => d.views));

  return (
    <div>
      <PageHeader title={t("admin.traffic.title")} />

      <DateRangePicker value={range} onChange={setRange} className="mb-6" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t("admin.traffic.uniqueVisitors")}
          value={stats?.uniqueVisitors ?? 0}
          icon={Users}
          accent="primary"
        />
        <StatCard
          title={t("admin.traffic.totalViews")}
          value={stats?.totalViews ?? 0}
          icon={Eye}
          accent="info"
        />
        <StatCard
          title={t("admin.traffic.activeToday")}
          value={stats?.logins.activeToday ?? 0}
          icon={LogIn}
          accent="success"
        />
        <StatCard
          title={t("admin.traffic.newUsers")}
          value={stats?.users.newInRange ?? 0}
          icon={UserPlus}
          accent="warning"
          trend={`${stats?.users.total ?? 0} tài khoản tổng cộng`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="font-semibold mb-1">{t("admin.traffic.byPage")}</h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            {t("admin.traffic.uniqueNote")}
          </p>
          <div className="space-y-3">
            {(stats?.pages ?? []).map((p) => (
              <div
                key={p.page}
                className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm">{PAGE_LABEL[p.page] ?? p.page}</span>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {t("admin.traffic.views")}
                    </p>
                    <p className="font-semibold tabular-nums">{p.views}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {t("admin.traffic.visitors")}
                    </p>
                    <p className="font-semibold tabular-nums">
                      {p.uniqueVisitors}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">{t("admin.traffic.logins")}</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <SimpleStatCard
              title={t("admin.traffic.loginTotal")}
              value={stats?.logins.total ?? 0}
            />
            <SimpleStatCard
              title={t("admin.traffic.loginUsers")}
              value={stats?.logins.uniqueUsers ?? 0}
            />
          </div>

          <p className="text-sm font-medium mb-2">
            {t("admin.traffic.loginFailed")}{" "}
            <span className="tabular-nums">({totalFailed})</span>
          </p>
          {totalFailed === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              {t("common.noData")}
            </p>
          ) : (
            <div className="space-y-1.5">
              {(stats?.logins.failed ?? []).map((f) => (
                <div
                  key={f.reason}
                  className="flex justify-between text-sm text-[var(--color-text-secondary)]"
                >
                  <span>{FAILURE_LABEL[f.reason] ?? f.reason}</span>
                  <span className="tabular-nums font-medium">{f.count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">{t("admin.traffic.daily")}</h2>
        {(stats?.daily ?? []).length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            {t("common.noData")}
          </p>
        ) : (
          <div className="space-y-1.5">
            {(stats?.daily ?? []).map((d) => (
              <div key={d.date} className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-muted)] w-24 shrink-0 tabular-nums">
                  {d.date}
                </span>
                <div className="flex-1 h-5 bg-[var(--color-bg-muted)] rounded-[var(--radius-md)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)]"
                    style={{ width: `${(d.views / peakViews) * 100}%` }}
                  />
                </div>
                <span className="text-sm tabular-nums w-12 text-right">
                  {d.views}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
