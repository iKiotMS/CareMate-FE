"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import { useCleanerJobs, useCleanerAppliedOrders } from "@/hooks/useApi";
import { formatOrderDate, orderIdShort } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
import { Loader2, Clock } from "lucide-react";

export default function AssignedJobsPage() {
  const { data: jobsRaw, isLoading, isError, refetch } = useCleanerJobs();
  const { data: appliedRaw, isLoading: loadingApplied } = useCleanerAppliedOrders();

  const list = (Array.isArray(jobsRaw) ? jobsRaw : []) as Order[];
  const applied = (Array.isArray(appliedRaw) ? appliedRaw : []) as Order[];

  return (
    <div>
      <PageHeader title={t("cleaner.assigned.title")} />

      {/* Applied / pending selection */}
      {applied.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
            Đã ứng tuyển — chờ khách chọn ({applied.length})
          </h2>
          <div className="space-y-3">
            {applied.map((job) => (
              <Card
                key={job._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-amber-300 bg-amber-50 dark:bg-amber-950/20"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Chờ khách chọn
                    </Badge>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      #{orderIdShort(job._id)}
                    </span>
                  </div>
                  <p className="font-medium">{job.address}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {formatOrderDate(job.scheduledDate)} · {job.scheduledTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    {job.totalAmount?.toLocaleString("vi-VN")} ₫
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Đơn sẽ được giao sau khi khách thanh toán cọc
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed / active jobs */}
      <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
        Việc đang thực hiện
      </h2>

      {isLoading || loadingApplied ? (
        <p className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </p>
      ) : isError ? (
        <p className="text-red-600">
          Lỗi tải việc.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>
            Thử lại
          </button>
        </p>
      ) : list.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">
          Chưa có việc nào được xác nhận.{" "}
          {applied.length === 0 && (
            <>
              <Link
                href="/cleaner/available-jobs"
                className="text-[var(--color-primary)] underline"
              >
                Ứng tuyển đơn mới
              </Link>
              {" "}— việc sẽ xuất hiện tại đây sau khi khách thanh toán đặt cọc.
            </>
          )}
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((job) => (
            <Card
              key={job._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <OrderStatusBadge status={job.status as OrderStatus} />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    #{orderIdShort(job._id)}
                  </span>
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
