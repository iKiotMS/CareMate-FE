"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { useAvailableOrders, useApplyForOrder } from "@/hooks/useApi";
import { formatOrderDate, scheduledDateKey, orderIdShort } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Order, OrderStatus } from "@/types";
import { cn } from "@/lib/cn";
import { Loader2, RefreshCw } from "lucide-react";

export default function AvailableJobsPage() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  const {
    data: jobsRaw,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAvailableOrders();
  const { mutateAsync: apply, isPending: applying, variables: applyingId } =
    useApplyForOrder();

  const jobs = (Array.isArray(jobsRaw) ? jobsRaw : []) as Order[];

  const filtered = jobs.filter((j) => {
    if (!dateFilter) return true;
    return scheduledDateKey(j.scheduledDate) === dateFilter;
  });

  const dateOptions = [...new Set(jobs.map((j) => scheduledDateKey(j.scheduledDate)))];

  const handleApply = async (orderId: string) => {
    setError("");
    setSuccessId(null);
    try {
      await apply(orderId);
      setSuccessId(orderId);
      await refetch();
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Không nhận được đơn. Có thể đã có người nhận trước hoặc trùng lịch làm việc.",
        ),
      );
    }
  };

  return (
    <div>
      <PageHeader
        title={t("cleaner.available.title")}
        subtitle="Đơn PENDING từ khách hàng — nhấn «Ứng tuyển» để được khách chọn"
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}
      {successId && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
          Ứng tuyển đơn #{orderIdShort(successId)} thành công! Chờ khách hàng chọn bạn.
        </div>
      )}

      <FormField label={t("cleaner.available.filterDate")} className="max-w-xs mb-6">
        <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="">Tất cả ngày</option>
          {dateOptions.map((d) => (
            <option key={d} value={d}>{formatOrderDate(d)}</option>
          ))}
        </Select>
      </FormField>

      {isLoading ? (
        <p className="flex items-center gap-2 text-[var(--color-text-muted)]">
          <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
        </p>
      ) : isError ? (
        <p className="text-red-600">Lỗi tải danh sách. Kiểm tra đăng nhập (cleaner) và API BE.</p>
      ) : filtered.length === 0 ? (
        <Card padding="lg">
          <p className="text-[var(--color-text-secondary)]">
            Hiện không có đơn PENDING. Yêu cầu khách hàng đặt lịch tại «Đặt dịch vụ», sau đó bấm làm mới.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <Card key={job._id}>
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-xs font-mono text-[var(--color-text-muted)]">#{orderIdShort(job._id)}</span>
                <OrderStatusBadge status={job.status as OrderStatus} />
              </div>
              <p className="font-medium text-[var(--color-text)]">{job.address}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {formatOrderDate(job.scheduledDate)} · {job.scheduledTime}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                {job.tasks?.map((tk) => tk.taskName).join(", ") || "—"}
              </p>
              {job.note && <p className="text-xs mt-2 italic text-[var(--color-text-muted)]">{job.note}</p>}
              {successId === job._id ? (
                <p className="mt-4 text-sm text-green-700 font-medium">✓ Đã ứng tuyển — chờ khách chọn</p>
              ) : (
                <Button
                  size="sm"
                  className="mt-4"
                  disabled={applying}
                  onClick={() => handleApply(job._id)}
                >
                  {applying && applyingId === job._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" /> Đang ứng tuyển...
                    </>
                  ) : (
                    "Ứng tuyển"
                  )}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
