"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { ProgressBar } from "@/components/shared/Charts";
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
import {
  Brain,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  RulerIcon,
  Upload,
  User,
  X,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/cn";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
  E_WALLET: "Ví điện tử",
};
const PAYMENT_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  UNPAID: { label: "Chưa thanh toán", color: "text-amber-700 dark:text-amber-300" },
  PAID: { label: "Đã thanh toán", color: "text-green-700 dark:text-green-300" },
  REFUNDED: { label: "Đã hoàn tiền", color: "text-blue-700 dark:text-blue-300" },
};

function PhotoLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition-colors"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

const DEPOSIT_AMOUNT = 30_000;

function taskCatalogIdOf(task: { taskCatalogId: string | { toString(): string } }): string {
  const id = task.taskCatalogId;
  return typeof id === "string" ? id : id.toString();
}

function PhotoUploadSlot({
  label,
  url,
  disabled,
  onChange,
}: {
  label: string;
  url: string | null | undefined;
  disabled: boolean;
  onChange: (files: FileList | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => onChange(e.target.files)}
      />
      {url ? (
        <div className="relative group">
          <img
            src={url}
            alt={label}
            className="w-full h-36 object-cover rounded-[var(--radius-lg)] border border-[var(--color-border)]"
          />
          <div className="absolute inset-0 bg-black/30 rounded-[var(--radius-lg)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              disabled={disabled}
              onClick={() => ref.current?.click()}
              className="text-white text-xs bg-black/50 px-3 py-1.5 rounded-full"
            >
              Đổi ảnh
            </button>
          </div>
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
              {label}
            </span>
          </div>
          <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-400 drop-shadow" />
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => ref.current?.click()}
          className={cn(
            "w-full h-36 rounded-[var(--radius-lg)] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors",
            disabled
              ? "border-[var(--color-border)] opacity-50 cursor-not-allowed"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer",
          )}
        >
          <Camera className="w-6 h-6 text-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
        </button>
      )}
    </div>
  );
}

export default function CleanerJobDetailPage({ params }: { params: { id: string } }) {
  const checkinRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
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
      <div className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </div>
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
  const allDone =
    tasks.length > 0 && tasks.every((t) => t.isDone && t.photoBefore && t.photoAfter);

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

  // ─── Tab: Thông tin đơn ────────────────────────────────────────────────────
  const infoTab = (
    <div className="space-y-5">
      {/* Mã đơn + trạng thái */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)] border border-[var(--color-border)]">
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Mã đơn</p>
          <p className="font-mono font-bold text-[var(--color-text)]">#{orderIdShort(order._id)}</p>
        </div>
        <OrderStatusBadge status={status as OrderStatus} />
      </div>

      {/* Khách hàng */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Khách hàng
        </p>
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-[var(--color-text)] truncate">
              {order.customerName ?? "Khách hàng"}
            </p>
            {order.customerPhone && (
              <a
                href={`tel:${order.customerPhone}`}
                className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mt-0.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {order.customerPhone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Địa chỉ */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Địa chỉ thực hiện
        </p>
        <div className="flex items-start gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <MapPin className="w-4 h-4 text-[var(--color-primary)] mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--color-text)]">{order.address}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(order.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-primary)] hover:underline mt-1 inline-block"
            >
              Mở trên bản đồ →
            </a>
          </div>
        </div>
      </div>

      {/* Lịch làm */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Lịch thực hiện
        </p>
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
          <Clock className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <div>
            <p className="font-medium text-sm text-[var(--color-text)]">
              {formatOrderDate(order.scheduledDate)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{order.scheduledTime}</p>
          </div>
        </div>
      </div>

      {/* Ghi chú */}
      {order.note && (
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Ghi chú từ khách
          </p>
          <div className="p-3 rounded-[var(--radius-lg)] bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700">
            <p className="text-sm text-amber-950 dark:text-amber-100">{order.note}</p>
          </div>
        </div>
      )}

      {/* Diện tích */}
      {order.areaM2 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Diện tích
          </p>
          <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)]">
            <RulerIcon className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <p className="text-sm font-medium text-[var(--color-text)]">{order.areaM2} m²</p>
          </div>
        </div>
      )}

      {/* Danh sách công việc + giá */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Công việc cần thực hiện
        </p>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 bg-[var(--color-surface)]">
              <div className="flex items-center gap-2 min-w-0">
                {task.isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--color-border)] shrink-0" />
                )}
                <div className="min-w-0">
                  <span className={cn(
                    "text-sm block truncate",
                    task.isDone ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text)]",
                  )}>
                    {task.taskName}
                  </span>
                  {task.isDone && task.photoBefore && task.photoAfter && (
                    <span className="text-xs text-[var(--color-success)]">✓ Có ảnh trước/sau</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-xs text-[var(--color-text-secondary)] tabular-nums">
                  {task.taskPrice?.toLocaleString("vi-VN")} ₫
                </span>
                {task.isDone && <Badge variant="success" className="text-xs">Xong</Badge>}
              </div>
            </div>
          ))}

          {/* Tổng */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-[var(--color-primary-soft)]">
            <span className="text-sm font-semibold text-[var(--color-text)]">Tổng giá trị</span>
            <span className="font-bold text-[var(--color-primary)] tabular-nums">
              {order.totalAmount?.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] px-1">
          Đặt cọc: {DEPOSIT_AMOUNT.toLocaleString("vi-VN")} ₫ · Còn lại:{" "}
          {Math.max(0, order.totalAmount - DEPOSIT_AMOUNT).toLocaleString("vi-VN")} ₫
        </p>
      </div>

      {/* Thanh toán */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Thanh toán
        </p>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 bg-[var(--color-surface)]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
              <span className="text-sm text-[var(--color-text-secondary)]">Phương thức</span>
            </div>
            <span className="text-sm font-medium text-[var(--color-text)]">
              {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 bg-[var(--color-surface)]">
            <span className="text-sm text-[var(--color-text-secondary)]">Trạng thái</span>
            <span className={cn(
              "text-sm font-medium",
              PAYMENT_STATUS_LABEL[order.paymentStatus]?.color ?? "text-[var(--color-text)]",
            )}>
              {PAYMENT_STATUS_LABEL[order.paymentStatus]?.label ?? order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Ảnh khách gửi trước */}
      {(order.photosBeforeBooking?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Ảnh khách gửi trước đặt lịch
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {order.photosBeforeBooking!.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxSrc(src)}
                className="relative group aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-muted)]"
              >
                <img src={src} alt={`before-booking-${i}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tiến độ */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Tiến độ
        </p>
        <ProgressBar value={doneCount} max={tasks.length} label={`${doneCount}/${tasks.length} công việc hoàn thành`} />
      </div>
    </div>
  );

  // ─── Tab: Check-in ────────────────────────────────────────────────────────
  const checkinTab = (
    <div className="space-y-4">
      {status === "CONFIRMED" && (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700">
          <p className="text-sm font-medium text-blue-950 dark:text-blue-100 mb-3">
            Bạn đã được xác nhận cho đơn này.
          </p>
          <Button onClick={handleAccept} disabled={accepting} className="w-full sm:w-auto">
            {accepting ? t("common.loading") : t("common.accept")}
          </Button>
        </Card>
      )}

      {status === "ACCEPTED" && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("cleaner.jobDetail.overallPhotos")}
          </p>
          <input
            ref={checkinRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleCheckIn(e.target.files)}
          />
          <div
            className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors"
            onClick={() => checkinRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto text-[var(--color-text-muted)] mb-2" />
            <p className="text-sm text-[var(--color-text-secondary)]">Chọn ảnh check-in khi đến nơi</p>
          </div>
          <Button
            className="w-full sm:w-auto"
            disabled={uploading || checkingIn}
            onClick={() => checkinRef.current?.click()}
          >
            {uploading || checkingIn ? t("common.loading") : t("cleaner.jobDetail.checkInBtn")}
          </Button>
        </div>
      )}

      {status === "IN_PROGRESS" && (
        <div className="space-y-3">
          <Badge variant="success">Đã check-in thành công</Badge>
          {(order.photosCheckin?.length ?? 0) > 0 && (
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Ảnh check-in tại hiện trường</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {order.photosCheckin!.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxSrc(src)}
                    className="relative group aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-muted)]"
                  >
                    <img src={src} alt={`check-in-${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {["REVIEW_PENDING", "PAYMENT_PENDING", "COMPLETED"].includes(status) && (
        <div className="space-y-3">
          <Badge variant="success">Đã hoàn thành quy trình</Badge>
          {(order.photosCheckin?.length ?? 0) > 0 && (
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Ảnh check-in tại hiện trường</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {order.photosCheckin!.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxSrc(src)}
                    className="relative group aspect-video rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-muted)]"
                  >
                    <img src={src} alt={`check-in-${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!["CONFIRMED", "ACCEPTED", "IN_PROGRESS", "REVIEW_PENDING", "PAYMENT_PENDING", "COMPLETED"].includes(status) && (
        <p className="text-sm text-[var(--color-text-muted)]">
          Chờ đơn được xác nhận trước khi check-in.
        </p>
      )}
    </div>
  );

  // ─── Tab: Thực hiện công việc ─────────────────────────────────────────────
  const canWork = ["IN_PROGRESS", "REVIEW_PENDING", "PAYMENT_PENDING", "COMPLETED"].includes(status);

  const tasksTab = (
    <div className="space-y-4">
      {!canWork && (
        <div className="p-3 rounded-[var(--radius-lg)] bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700">
          <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
            Hoàn tất check-in trước khi thực hiện từng công việc.
          </p>
        </div>
      )}

      {tasks.map((task, i) => {
        const beforeUrl = task.photoBefore ?? pendingTaskPhotos[i]?.before ?? null;
        const afterUrl = task.photoAfter ?? pendingTaskPhotos[i]?.after ?? null;
        const isTaskDone = task.isDone;

        return (
          <Card
            key={i}
            padding="sm"
            className={cn(
              "border transition-colors",
              isTaskDone
                ? "border-[var(--color-success)]/40 bg-[var(--color-success)]/5"
                : "border-[var(--color-border)]",
            )}
          >
            {/* Header task */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {isTaskDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-[var(--color-border)] shrink-0" />
                )}
                <p className="font-medium text-[var(--color-text)]">{task.taskName}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[var(--color-text-muted)] tabular-nums">
                  {task.taskPrice?.toLocaleString("vi-VN")} ₫
                </span>
                {isTaskDone && (
                  <Badge variant="success" className="text-xs">Xong</Badge>
                )}
              </div>
            </div>

            {/* Khi task đã xong: hiển thị ảnh to, rõ ràng */}
            {isTaskDone && (beforeUrl || afterUrl) ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                  Ảnh minh chứng
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {beforeUrl && (
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-1.5 font-medium flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                        Trước khi dọn
                      </p>
                      <button
                        type="button"
                        onClick={() => setLightboxSrc(beforeUrl)}
                        className="relative group w-full block rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)]"
                      >
                        <img
                          src={beforeUrl}
                          alt="Ảnh trước"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                        </div>
                      </button>
                    </div>
                  )}
                  {afterUrl && (
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-1.5 font-medium flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                        Sau khi dọn
                      </p>
                      <button
                        type="button"
                        onClick={() => setLightboxSrc(afterUrl)}
                        className="relative group w-full block rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)]"
                      >
                        <img
                          src={afterUrl}
                          alt="Ảnh sau"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Khi task chưa xong: slot upload */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1.5 font-medium">
                      Ảnh trước khi dọn
                    </p>
                    <PhotoUploadSlot
                      label="Ảnh trước"
                      url={beforeUrl}
                      disabled={!canWork || status !== "IN_PROGRESS" || uploading || markingTask}
                      onChange={(files) => handleTaskPhoto(i, "before", files)}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1.5 font-medium">
                      Ảnh sau khi dọn
                    </p>
                    <PhotoUploadSlot
                      label="Ảnh sau"
                      url={afterUrl}
                      disabled={!canWork || status !== "IN_PROGRESS" || uploading || markingTask || !beforeUrl}
                      onChange={(files) => handleTaskPhoto(i, "after", files)}
                    />
                  </div>
                </div>

                {/* Hướng dẫn */}
                {status === "IN_PROGRESS" && (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {!beforeUrl
                      ? "Chụp ảnh trước khi bắt đầu dọn."
                      : !afterUrl
                      ? "Chụp ảnh sau khi hoàn thành — công việc sẽ tự đánh dấu xong."
                      : "Đang lưu..."}
                  </p>
                )}

                {/* Uploading indicator */}
                {uploading && pendingTaskPhotos[i] !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                    <Loader2 className="w-3 h-3 animate-spin" /> Đang tải ảnh...
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {tasks.length > 0 && (
        <ProgressBar
          value={doneCount}
          max={tasks.length}
          label={`${doneCount}/${tasks.length} công việc hoàn thành`}
        />
      )}
    </div>
  );

  // ─── Tab: Hoàn thành ─────────────────────────────────────────────────────
  const completeTab = (
    <div className="space-y-4">
      {status === "REVIEW_PENDING" && (
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700">
          <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
            Đã hoàn thành — đang chờ khách hàng đánh giá.
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
            Khách sẽ để lại đánh giá và thanh toán phần còn lại.
          </p>
        </Card>
      )}

      {status === "PAYMENT_PENDING" && (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700">
          <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">
            Khách đã đánh giá — đang chờ thanh toán phần còn lại.
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
            Thu nhập sẽ được ghi nhận sau khi thanh toán hoàn tất.
          </p>
        </Card>
      )}

      {status === "COMPLETED" && (
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700">
          <p className="text-sm font-semibold text-green-950 dark:text-green-100">
            ✓ Đơn hoàn thành — thanh toán đã được xác nhận.
          </p>
          <p className="text-xs text-green-800 dark:text-green-200 mt-1">
            Thu nhập từ đơn này đã được ghi nhận.
          </p>
        </Card>
      )}

      {status === "IN_PROGRESS" && (
        <>
          <Card className="bg-[var(--color-bg-muted)]">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-medium text-sm">Điều kiện hoàn thành</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {allDone ? (
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--color-border)] inline-block" />
                )}
                <span className={allDone ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"}>
                  {t("cleaner.jobDetail.allTasksDone")} ({doneCount}/{tasks.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {allDone ? (
                  <Check className="w-4 h-4 text-[var(--color-success)]" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--color-border)] inline-block" />
                )}
                <span className={allDone ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"}>
                  {t("cleaner.jobDetail.allPhotosUploaded")}
                </span>
              </div>
            </div>
          </Card>
          <Button
            disabled={!allDone || completing}
            onClick={handleComplete}
            className="w-full sm:w-auto"
          >
            {completing ? t("common.loading") : t("cleaner.jobDetail.completeJob")}
          </Button>
          {!allDone && (
            <p className="text-xs text-[var(--color-text-muted)]">
              Hoàn thành tất cả công việc và chụp đủ ảnh trước/sau để có thể nộp kết quả.
            </p>
          )}
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
      {lightboxSrc && (
        <PhotoLightbox
          src={lightboxSrc}
          alt="Ảnh phóng to"
          onClose={() => setLightboxSrc(null)}
        />
      )}

      <Link
        href="/cleaner/jobs"
        className="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block"
      >
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
