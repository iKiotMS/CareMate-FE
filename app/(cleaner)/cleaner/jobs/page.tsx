"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { getCleanerAssignedJobs, formatDate } from "@/data/mock";
import type { OrderStatus } from "@/types";

export default function AssignedJobsPage() {
  const jobs = getCleanerAssignedJobs();

  return (
    <div>
      <PageHeader title={t("cleaner.assigned.title")} />
      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <OrderStatusBadge status={job.status as OrderStatus} />
                <span className="text-xs text-[var(--color-text-muted)]">#{job._id.slice(-6)}</span>
              </div>
              <p className="font-medium">{job.address}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{formatDate(job.scheduledDate)} · {job.scheduledTime}</p>
            </div>
            <Link href={`/cleaner/jobs/${job._id}`}>
              <Button size="sm">{t("common.view")}</Button>
            </Link>
          </Card>
        ))}
        {jobs.length === 0 && <p className="text-[var(--color-text-muted)]">{t("common.noData")}</p>}
      </div>
    </div>
  );
}
