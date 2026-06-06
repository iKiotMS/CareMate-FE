"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SimpleStatCard } from "@/components/shared/StatCard";
import { t } from "@/lib/i18n";
import { useAvailableOrders, useCleanerJobs } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

export default function CleanerDashboardPage() {
  const { data: availableRaw, isLoading: loadingAvailable } = useAvailableOrders();
  const { data: jobsRaw, isLoading: loadingJobs } = useCleanerJobs();

  const availableCount = Array.isArray(availableRaw) ? availableRaw.length : 0;
  const jobs = Array.isArray(jobsRaw) ? jobsRaw : [];
  const today = new Date().toISOString().split("T")[0];
  const todayJobs = jobs.filter((j: { scheduledDate: string }) =>
    new Date(j.scheduledDate).toISOString().startsWith(today),
  ).length;

  const loading = loadingAvailable || loadingJobs;

  return (
    <div>
      <PageHeader title={t("cleaner.dashboard.title")} />

      {loading ? (
        <p className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/cleaner/available-jobs">
            <SimpleStatCard title={t("cleaner.dashboard.availableJobs")} value={availableCount} />
          </Link>
          <SimpleStatCard title={t("cleaner.dashboard.todayJobs")} value={todayJobs} />
          <SimpleStatCard title="Việc đang giao" value={jobs.length} />
        </div>
      )}
    </div>
  );
}
