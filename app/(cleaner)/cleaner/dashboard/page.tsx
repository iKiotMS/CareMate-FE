"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SimpleStatCard } from "@/components/shared/StatCard";
import { t } from "@/lib/i18n";
import { getPendingOrders, getCleanerAssignedJobs, MOCK_USERS } from "@/data/mock";

export default function CleanerDashboardPage() {
  const available = getPendingOrders().length;
  const assigned = getCleanerAssignedJobs();
  const today = assigned.filter((o) => o.scheduledDate.startsWith("2026-06-02")).length;
  const cleaner = MOCK_USERS.cleaner;

  return (
    <div>
      <PageHeader title={t("cleaner.dashboard.title")} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/cleaner/available-jobs"><SimpleStatCard title={t("cleaner.dashboard.availableJobs")} value={available} /></Link>
        <SimpleStatCard title={t("cleaner.dashboard.todayJobs")} value={today} />
        <SimpleStatCard title={t("cleaner.dashboard.completedJobs")} value={cleaner.completedJobs ?? 0} />
        <SimpleStatCard title={t("cleaner.dashboard.rating")} value={`${cleaner.rating}★`} />
      </div>
    </div>
  );
}
