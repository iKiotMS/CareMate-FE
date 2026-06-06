"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { useCleanerJobs } from "@/hooks/useApi";
import { formatOrderDate, orderIdShort } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
import { Loader2 } from "lucide-react";

export default function AssignedJobsPage() {
  const { data: jobsRaw, isLoading, isError, refetch } = useCleanerJobs();
  const list = (Array.isArray(jobsRaw) ? jobsRaw : []) as Order[];

  return (
    <div>
      <PageHeader title={t("cleaner.assigned.title")} />

      {isLoading ? (
        <p className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </p>
      ) : isError ? (
        <p className="text-red-600">
          Lỗi tải việc. <button type="button" className="underline" onClick={() => refetch()}>Thử lại</button>
        </p>
      ) : list.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">
          Chưa có việc được giao.{" "}
          <Link href="/cleaner/available-jobs" className="text-[var(--color-primary)] underline">
            Xem việc khả dụng
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((job) => (
            <Card key={job._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <OrderStatusBadge status={job.status as OrderStatus} />
                  <span className="text-xs text-[var(--color-text-muted)]">#{orderIdShort(job._id)}</span>
                </div>
                <p className="font-medium">{job.address}</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {formatOrderDate(job.scheduledDate)} · {job.scheduledTime}
                </p>
              </div>
              <Link href={`/cleaner/jobs/${job._id}`}>
                <Button size="sm">{t("common.view")}</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
