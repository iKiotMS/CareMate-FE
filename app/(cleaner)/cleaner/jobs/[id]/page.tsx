"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { PhotoGrid, ProgressBar } from "@/components/shared/Charts";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";
import {
  useCleanerJobDetail,
  useAcceptJob,
  useCheckInJob,
  useMarkTaskDone,
  useCompleteJob,
  useUploadPhotos,
} from "@/hooks/useApi";
import { formatOrderDate, orderIdShort } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Order, OrderStatus } from "@/types";
import { Check, Upload, Brain, Loader2 } from "lucide-react";

function taskCatalogIdOf(task: { taskCatalogId: string | { toString(): string } }): string {
  const id = task.taskCatalogId;
  return typeof id === "string" ? id : id.toString();
}

export default function CleanerJobDetailPage({ params }: { params: { id: string } }) {
  const checkinRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingTaskPhotos, setPendingTaskPhotos] = useState<
    Record<number, { before?: string; after?: string }>
  >({});

  const { data: orderRaw, isLoading, refetch } = useCleanerJobDetail(params.id);
  const { mutateAsync: acceptJob, isPending: accepting } = useAcceptJob();
  const { mutateAsync: checkInJob, isPending: checkingIn } = useCheckInJob();
  const { mutateAsync: markTaskDone, isPending: markingTask } = useMarkTaskDone();
  const { mutateAsync: completeJob, isPending: completing } = useCompleteJob();
  const { mutateAsync: uploadPhotos } = useUploadPhotos();

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </p>
    );
  }

  const order = orderRaw as Order | undefined;
  if (!order) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)]">
        Không tìm thấy công việc
      </div>
    );
  }

  const status = order.status;
  const tasks = order.tasks ?? [];
  const doneCount = tasks.filter((t) => t.isDone).length;
  const allDone = tasks.length > 0 && tasks.every((t) => t.isDone && t.photoBefore && t.photoAfter);

  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files?.length) return [];
    const res = await uploadPhotos(Array.from(files));
    return (res.data as { urls: string[] }).urls ?? [];
  };

  const handleAccept = async () => {
    setError("");
    try {
      await acceptJob(params.id);
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleCheckIn = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    try {
      const urls = await uploadFiles(files);
      await checkInJob({ jobId: params.id, photos: urls });
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleTaskPhoto = async (
    taskIndex: number,
    kind: "before" | "after",
    files: FileList | null,
  ) => {
    if (!files?.length) return;
    const task = tasks[taskIndex];
    const taskId = taskCatalogIdOf(task);
    setError("");
    setUploading(true);
    try {
      const [url] = await uploadFiles(files);
      const pending = {
        ...pendingTaskPhotos[taskIndex],
        before: task.photoBefore ?? pendingTaskPhotos[taskIndex]?.before,
        after: task.photoAfter ?? pendingTaskPhotos[taskIndex]?.after,
        [kind]: url,
      };
      setPendingTaskPhotos((prev) => ({ ...prev, [taskIndex]: pending }));
      if (pending.before && pending.after) {
        await markTaskDone({
          jobId: params.id,
          taskCatalogId: taskId,
          photoBefore: pending.before,
          photoAfter: pending.after,
        });
        setPendingTaskPhotos((prev) => {
          const next = { ...prev };
          delete next[taskIndex];
          return next;
        });
        refetch();
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = async () => {
    setError("");
    try {
      await completeJob(params.id);
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const infoTab = (
    <div className="space-y-4">
      <div>
        <span className="text-sm text-[var(--color-text-muted)]">{t("customer.book.address")}</span>
        <p className="font-medium">{order.address}</p>
      </div>
      <div>
        <span className="text-sm text-[var(--color-text-muted)]">{t("customer.book.date")}</span>
        <p className="font-medium">
          {formatOrderDate(order.scheduledDate)} · {order.scheduledTime}
        </p>
      </div>
      {order.customerPhone && (
        <div>
          <span className="text-sm text-[var(--color-text-muted)]">Liên hệ khách hàng</span>
          <p className="font-medium">
            <a
              href={`tel:${order.customerPhone}`}
              className="text-[var(--color-primary)] hover:underline"
            >
              {order.customerPhone}
            </a>
            {order.customerName && (
              <span className="text-[var(--color-text-muted)] ml-2 text-sm">({order.customerName})</span>
            )}
          </p>
        </div>
      )}
      {order.note && (
        <div>
          <span className="text-sm text-[var(--color-text-muted)]">{t("cleaner.jobDetail.notes")}</span>
          <p>{order.note}</p>
        </div>
      )}
      <div>
        <span className="text-sm text-[var(--color-text-muted)]">{t("customer.orderDetail.tasks")}</span>
        <ul className="mt-2 space-y-1">
          {tasks.map((task, i) => (
            <li key={i} className="text-sm">
              • {task.taskName}
              {task.isDone && <span className="text-[var(--color-success)] ml-1">✓</span>}
            </li>
          ))}
        </ul>
      </div>
      {(order.photosBeforeBooking?.length ?? 0) > 0 && (
        <div>
          <span className="text-sm text-[var(--color-text-muted)]">Ảnh khách gửi trước đặt lịch</span>
          <PhotoGrid photos={order.photosBeforeBooking!} />
        </div>
      )}
    </div>
  );

  const checkinTab = (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-secondary)]">{t("cleaner.jobDetail.overallPhotos")}</p>
      {(order.photosCheckin?.length ?? 0) > 0 && <PhotoGrid photos={order.photosCheckin!} />}
      <input
        ref={checkinRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleCheckIn(e.target.files)}
      />
      {status === "CONFIRMED" && (
        <Button onClick={handleAccept} disabled={accepting}>
          {accepting ? t("common.loading") : t("common.accept")}
        </Button>
      )}
      {status === "ACCEPTED" && (
        <>
          <div
            className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 text-center cursor-pointer"
            onClick={() => checkinRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto text-[var(--color-text-muted)] mb-2" />
            <p className="text-sm">Chọn ảnh check-in</p>
          </div>
          <Button disabled={uploading || checkingIn} onClick={() => checkinRef.current?.click()}>
            {uploading || checkingIn ? t("common.loading") : t("cleaner.jobDetail.checkInBtn")}
          </Button>
        </>
      )}
      {status === "IN_PROGRESS" && <Badge variant="success">Đã check-in</Badge>}
      {["REVIEW_PENDING", "PAYMENT_PENDING", "COMPLETED"].includes(status) && (
        <Badge variant="success">Đã hoàn thành quy trình</Badge>
      )}
    </div>
  );

  const tasksTab = (
    <div className="space-y-4">
      {!["IN_PROGRESS", "REVIEW_PENDING", "PAYMENT_PENDING", "COMPLETED"].includes(status) && (
        <p className="text-sm text-amber-600">Check-in trước khi làm từng công việc.</p>
      )}
      {tasks.map((task, i) => (
        <Card key={i} padding="sm" className="border border-[var(--color-border)]">
          <p className="font-medium mb-3">{task.taskName}</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={status !== "IN_PROGRESS" || uploading || markingTask}
                onChange={(e) => handleTaskPhoto(i, "before", e.target.files)}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={status !== "IN_PROGRESS" || uploading}
                onClick={(e) => {
                  const input = (e.currentTarget.parentElement as HTMLLabelElement)?.querySelector("input");
                  input?.click();
                }}
              >
                {t("cleaner.jobDetail.beforePhoto")}{" "}
                {(task.photoBefore || pendingTaskPhotos[i]?.before) && "✓"}
              </Button>
            </label>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={status !== "IN_PROGRESS" || uploading || markingTask}
                onChange={(e) => handleTaskPhoto(i, "after", e.target.files)}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={status !== "IN_PROGRESS" || uploading}
                onClick={(e) => {
                  const input = (e.currentTarget.parentElement as HTMLLabelElement)?.querySelector("input");
                  input?.click();
                }}
              >
                {t("cleaner.jobDetail.afterPhoto")}{" "}
                {(task.photoAfter || pendingTaskPhotos[i]?.after) && "✓"}
              </Button>
            </label>
          </div>
          {task.isDone && <Badge variant="success">{t("cleaner.jobDetail.markDone")}</Badge>}
        </Card>
      ))}
      {tasks.length > 0 && (
        <ProgressBar value={doneCount} max={tasks.length} label={`${doneCount}/${tasks.length} công việc`} />
      )}
    </div>
  );

  const completeTab = (
    <div className="space-y-4">
      {status === "REVIEW_PENDING" && (
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Đã hoàn thành công việc — đang chờ khách hàng đánh giá.
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            Khách sẽ để lại đánh giá và tiến hành thanh toán phần còn lại.
          </p>
        </Card>
      )}

      {status === "PAYMENT_PENDING" && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Khách đã đánh giá — đang chờ thanh toán phần còn lại.
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Thu nhập sẽ được ghi nhận sau khi thanh toán hoàn tất.
          </p>
        </Card>
      )}

      {status === "COMPLETED" && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            ✓ Đơn hoàn thành — thanh toán đã được xác nhận.
          </p>
        </Card>
      )}

      {status === "IN_PROGRESS" && (
        <>
          <Card className="bg-[var(--color-bg-muted)]">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-medium">{t("cleaner.jobDetail.aiCheck")}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                {allDone ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : "○"}{" "}
                {t("cleaner.jobDetail.allTasksDone")}
              </p>
              <p className="flex items-center gap-2">
                {allDone ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : "○"}{" "}
                {t("cleaner.jobDetail.allPhotosUploaded")}
              </p>
            </div>
          </Card>
          <Button disabled={!allDone || completing} onClick={handleComplete}>
            {completing ? t("common.loading") : t("cleaner.jobDetail.completeJob")}
          </Button>
        </>
      )}

      {!["IN_PROGRESS", "REVIEW_PENDING", "PAYMENT_PENDING", "COMPLETED"].includes(status) && (
        <p className="text-sm text-[var(--color-text-muted)]">
          Hoàn thành check-in và tất cả công việc trước khi nộp kết quả.
        </p>
      )}
    </div>
  );

  return (
    <div>
      <Link href="/cleaner/jobs" className="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">
        ← {t("common.back")}
      </Link>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <PageHeader
        title={`Công việc #${orderIdShort(order._id)}`}
        action={<OrderStatusBadge status={status as OrderStatus} />}
      />

      <Tabs
        tabs={[
          { id: "info", label: t("cleaner.jobDetail.tabInfo"), content: infoTab },
          { id: "checkin", label: t("cleaner.jobDetail.tabCheckin"), content: checkinTab },
          { id: "tasks", label: t("cleaner.jobDetail.tabTasks"), content: tasksTab },
          { id: "complete", label: t("cleaner.jobDetail.tabComplete"), content: completeTab },
        ]}
        defaultTab="info"
      />
    </div>
  );
}
