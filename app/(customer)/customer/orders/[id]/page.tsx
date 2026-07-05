"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Timeline } from "@/components/shared/Timeline";
import { StarRating } from "@/components/shared/StarRating";
import { PhotoGrid } from "@/components/shared/Charts";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea, FormField } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/lib/i18n";
import {
  useCustomerOrderDetail,
  useCancelOrder,
  useSubmitReview,
  useDepositInfo,
  useFinalPaymentInfo,
  useOrderApplicants,
  useSelectCleaner,
} from "@/hooks/useApi";
import { formatOrderDate } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api-errors";
import { cn } from "@/lib/cn";
import type { Order, OrderStatus } from "@/types";
import { AlertCircle, ArrowLeft, Loader2, UserCheck } from "lucide-react";

export default function CustomerOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const orderId = params.id;

  const {
    data: orderRaw,
    isLoading,
    refetch,
  } = useCustomerOrderDetail(orderId);
  const { mutateAsync: cancelOrder, isPending: cancelling } = useCancelOrder();
  const { mutateAsync: submitReview, isPending: reviewing } = useSubmitReview();
  const { mutateAsync: selectCleaner, isPending: selecting } =
    useSelectCleaner();

  const order = orderRaw as Order | undefined;

  // Conditionally fetch payment info
  const { data: depositInfo } = useDepositInfo(
    order?.status === "ON_HOLD_PAYMENT" ? orderId : "",
  );
  const { data: finalPaymentInfo } = useFinalPaymentInfo(
    order?.status === "PAYMENT_PENDING" ? orderId : "",
  );
  const { data: applicantsRaw } = useOrderApplicants(
    order?.status === "PENDING" ? orderId : "",
  );

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState("");
  const [selectedCleanerIds, setSelectedCleanerIds] = useState<string[]>([]);

  // The data query is gated on `hasToken()`, which reads a browser cookie and is
  // therefore always false during SSR but true on the client's first render — that
  // divergence made the server emit the "not found" markup while the client emitted
  // the skeleton, causing a hydration mismatch. Render the skeleton until mounted so
  // the first client render matches the server output.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-56 w-full rounded-[var(--radius-xl)]" />
            <Skeleton className="h-40 w-full rounded-[var(--radius-xl)]" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-[var(--radius-xl)]" />
            <Skeleton className="h-24 w-full rounded-[var(--radius-xl)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-[var(--color-text-muted)]">
        Không tìm thấy đơn hàng
      </div>
    );
  }

  const statusOrder = [
    "PENDING",
    "ON_HOLD_PAYMENT",
    "CONFIRMED",
    "ACCEPTED",
    "IN_PROGRESS",
    "REVIEW_PENDING",
    "PAYMENT_PENDING",
    "COMPLETED",
  ];
  const currentIdx = statusOrder.indexOf(order.status);

  const timeline = [
    {
      key: "created",
      label: "Đã đặt đơn",
      date: order.createdAt ? formatOrderDate(order.createdAt) : undefined,
      done: true,
    },
    {
      key: "applicants",
      label: "Chọn nhân viên",
      done:
        currentIdx >= 1 ||
        (order.cleanerIds?.length ?? 0) > 0 ||
        (order.pendingCleanerIds?.length ?? 0) > 0,
    },
    {
      key: "deposit",
      label: "Đặt cọc 30.000 ₫",
      done: currentIdx >= 2,
      active: order.status === "ON_HOLD_PAYMENT",
    },
    {
      key: "confirmed",
      label: "Đã xác nhận",
      done: currentIdx >= 2,
      active: order.status === "CONFIRMED",
    },
    {
      key: "checkin",
      label: "Nhân viên đến",
      done: currentIdx >= 4,
      active: order.status === "ACCEPTED",
    },
    {
      key: "inprogress",
      label: "Đang dọn",
      done: currentIdx >= 5,
      active: order.status === "IN_PROGRESS",
    },
    {
      key: "review",
      label: "Đánh giá",
      done: currentIdx >= 7,
      active: order.status === "REVIEW_PENDING",
    },
    {
      key: "final_payment",
      label: "Thanh toán cuối",
      done: order.status === "COMPLETED",
      active: order.status === "PAYMENT_PENDING",
    },
    {
      key: "completed",
      label: t("customer.timeline.completed"),
      done: order.status === "COMPLETED",
    },
  ];

  const handleCancel = async () => {
    if (!confirm("Bạn chắc chắn muốn hủy đơn?")) return;
    setError("");
    try {
      await cancelOrder({ orderId });
      router.push("/customer/orders");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await submitReview({ orderId, rating, comment });
      setShowReview(false);
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const numCleaners = order.numCleaners ?? 1;

  const toggleCleaner = (cleanerId: string) => {
    setSelectedCleanerIds((prev) => {
      if (prev.includes(cleanerId)) return prev.filter((id) => id !== cleanerId);
      if (prev.length >= numCleaners) {
        // single-cleaner orders: replace; multi: ignore once full
        return numCleaners === 1 ? [cleanerId] : prev;
      }
      return [...prev, cleanerId];
    });
  };

  const handleConfirmSelection = async () => {
    if (selectedCleanerIds.length === 0) return;
    setError("");
    try {
      await selectCleaner({ orderId, cleanerIds: selectedCleanerIds });
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const applicants = (applicantsRaw as any[]) ?? [];
  const pendingApplicants = applicants.filter((a) => a.status === "PENDING");

  return (
    <div>
      <Link
        href="/customer/orders"
        className="group mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-2.5 pr-4 text-sm font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-xs)] transition-all duration-150 hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] active:scale-[0.98]"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-transform duration-150 group-hover:-translate-x-0.5">
          <ArrowLeft className="h-4 w-4" />
        </span>
        {t("common.back")}
      </Link>

      {error && (
        <div className="mb-4 animate-fade-in rounded-[var(--radius-lg)] bg-[var(--color-danger-soft)] p-3.5 text-sm font-medium text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <PageHeader
        title={t("customer.orderDetail.title")}
        subtitle={order.address}
        action={<OrderStatusBadge status={order.status as OrderStatus} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card>
            <h2 className="font-semibold text-[var(--color-text)] mb-4">
              {t("customer.orderDetail.timeline")}
            </h2>
            <Timeline items={timeline} />
          </Card>

          {/* Applicants section — visible when PENDING and cleaners have applied */}
          {order.status === "PENDING" && pendingApplicants.length > 0 && (
            <Card>
              <h2 className="font-semibold text-[var(--color-text)] mb-1">
                Nhân viên ứng tuyển ({pendingApplicants.length})
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                Đơn cần <strong>{numCleaners}</strong> nhân viên — đã chọn{" "}
                <strong>{selectedCleanerIds.length}</strong>/{numCleaners}.
              </p>
              <div className="space-y-3">
                {pendingApplicants.map((applicant: any) => {
                  const picked = selectedCleanerIds.includes(applicant.cleanerId);
                  return (
                    <button
                      key={applicant.cleanerId}
                      type="button"
                      onClick={() => toggleCleaner(applicant.cleanerId)}
                      className={cn(
                        "w-full text-left flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] border-2 transition-all duration-150 active:scale-[0.99]",
                        picked
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-[var(--shadow-xs)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-hover)]",
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {(applicant.cleanerName ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {applicant.cleanerName ?? "Nhân viên"}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {applicant.cleanerRating != null
                            ? `★ ${Number(applicant.cleanerRating).toFixed(1)}`
                            : "Chưa có đánh giá"}{" "}
                          · {applicant.completedJobs ?? 0} đơn
                        </p>
                      </div>
                      {picked && (
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                          <UserCheck className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <Button
                className="w-full mt-4"
                size="lg"
                disabled={selecting || selectedCleanerIds.length === 0}
                onClick={handleConfirmSelection}
              >
                {selecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Xác nhận chọn ${selectedCleanerIds.length > 0 ? `(${selectedCleanerIds.length})` : ""}`
                )}
              </Button>
            </Card>
          )}

          {order.status === "PENDING" && pendingApplicants.length === 0 && (
            <div className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-text-muted)]">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--color-primary)]" />
              Đang chờ nhân viên ứng tuyển... Bạn sẽ nhận được thông báo khi có
              ứng viên.
            </div>
          )}

          {/* Deposit QR — ON_HOLD_PAYMENT */}
          {order.status === "ON_HOLD_PAYMENT" && depositInfo && (
            <Card className="border-[var(--color-warning)]/25 bg-[var(--color-warning-soft)]">
              <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
                  <h2 className="font-semibold text-[var(--color-text)]">Đặt cọc để xác nhận đơn</h2>
                </div>
                <CountdownTimer expiresAt={(depositInfo as any).expiresAt} />
              </div>
              <div className="mt-4 text-center">
                <img
                  src={(depositInfo as any).qrDataUrl}
                  alt="QR đặt cọc"
                  className="mx-auto w-full max-w-[208px] aspect-square rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4 border border-[var(--color-border)]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Số tiền đặt cọc
                  </span>
                  <span className="font-bold text-[var(--color-primary)]">
                    {Number((depositInfo as any).amount)} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Ngân hàng
                  </span>
                  <span>{(depositInfo as any).bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Số tài khoản
                  </span>
                  <span className="font-mono">
                    {(depositInfo as any).accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Tên tài khoản
                  </span>
                  <span>{(depositInfo as any).accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Nội dung CK
                  </span>
                  <code className="font-bold text-[var(--color-primary)] bg-[var(--color-primary-soft)] px-2 py-0.5 rounded break-all text-right max-w-[160px]">
                    {(depositInfo as any).content}
                  </code>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
                Đơn sẽ tự động xác nhận sau khi nhận được thanh toán.
              </p>
            </Card>
          )}

          {/* Final payment QR — PAYMENT_PENDING */}
          {order.status === "PAYMENT_PENDING" && finalPaymentInfo && (
            <Card className="border-[var(--color-info)]/25 bg-[var(--color-info-soft)]">
              <h2 className="font-semibold text-[var(--color-text)] mb-3">Thanh toán phần còn lại</h2>
              <div className="mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Tổng dịch vụ
                  </span>
                  <span>
                    {Number((finalPaymentInfo as any).originalTotal)} ₫
                  </span>
                </div>
                <div className="flex justify-between text-[var(--color-success)]">
                  <span>Đã đặt cọc</span>
                  <span>
                    − {Number((finalPaymentInfo as any).depositPaid)} ₫
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-[var(--color-info)]/20 pt-2.5">
                  <span className="text-[var(--color-text)]">Còn lại</span>
                  <span className="text-[var(--color-primary)]">
                    {Number((finalPaymentInfo as any).amount)} ₫
                  </span>
                </div>
              </div>
              <div className="text-center">
                <img
                  src={(finalPaymentInfo as any).qrDataUrl}
                  alt="QR thanh toán cuối"
                  className="mx-auto w-full max-w-[208px] aspect-square rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-4 border border-[var(--color-border)]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Ngân hàng
                  </span>
                  <span>{(finalPaymentInfo as any).bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Số tài khoản
                  </span>
                  <span className="font-mono">
                    {(finalPaymentInfo as any).accountNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Nội dung CK
                  </span>
                  <code className="font-bold text-[var(--color-primary)] bg-[var(--color-primary-soft)] px-2 py-0.5 rounded break-all text-right max-w-[160px]">
                    {(finalPaymentInfo as any).content}
                  </code>
                </div>
              </div>
              <CountdownTimer
                expiresAt={(finalPaymentInfo as any).expiresAt}
                label="Hết hạn thanh toán sau"
              />
            </Card>
          )}

          {/* Tasks */}
          <Card>
            <h2 className="font-semibold text-[var(--color-text)] mb-4">
              {t("customer.orderDetail.tasks")}
            </h2>
            <ul className="space-y-2.5">
              {order.tasks?.map((task, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-[var(--color-text)]">{task.taskName}</span>
                  {task.isDone && <Badge variant="success">✓</Badge>}
                </li>
              ))}
            </ul>
          </Card>

          {(order.photosBeforeBooking?.length ?? 0) > 0 && (
            <Card>
              <h2 className="font-semibold text-[var(--color-text)] mb-3">
                {t("customer.orderDetail.photosBefore")}
              </h2>
              <PhotoGrid photos={order.photosBeforeBooking} />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="space-y-3.5">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t("customer.orders.date")}
              </p>
              <p className="font-medium text-[var(--color-text)]">
                {formatOrderDate(order.scheduledDate)} · {order.scheduledTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Thời lượng
              </p>
              <p className="font-medium text-[var(--color-text)]">
                {order.durationHours ?? "—"} giờ · {order.numCleaners ?? 1} nhân viên
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t("customer.orders.cleaner")}
              </p>
              <p className="font-medium text-[var(--color-text)]">
                {order.cleanerNames && order.cleanerNames.length > 0
                  ? order.cleanerNames.join(", ")
                  : order.cleanerName
                    ? order.cleanerName
                    : order.status === "PENDING"
                      ? t("customer.orders.notAssigned")
                      : order.status === "ON_HOLD_PAYMENT"
                        ? "Đang chờ xác nhận thanh toán"
                        : t("customer.orders.notAssigned")}
              </p>
              {order.status === "PENDING" && (
                <p className="text-xs font-medium text-[var(--color-warning)] mt-1.5">
                  {pendingApplicants.length > 0
                    ? `${pendingApplicants.length} nhân viên đã ứng tuyển — hãy chọn 1 người`
                    : "Đang chờ nhân viên ứng tuyển..."}
                </p>
              )}
            </div>
            {order.note && (
              <div className="border-t border-[var(--color-border)] pt-3.5">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {order.note}
                </p>
              </div>
            )}
          </Card>

          {/* Total */}
          <Card>
            <p className="text-sm text-[var(--color-text-muted)]">Tổng tiền</p>
            <p className="text-2xl font-bold tracking-tight text-[var(--color-primary)] mt-1">
              {Number(order.totalAmount).toLocaleString("vi-VN")} ₫
            </p>
            {[
              "ON_HOLD_PAYMENT",
              "CONFIRMED",
              "ACCEPTED",
              "IN_PROGRESS",
              "REVIEW_PENDING",
              "PAYMENT_PENDING",
            ].includes(order.status) && (
              <div className="mt-3 space-y-2 text-xs text-[var(--color-text-muted)]">
                <div className="h-1.5 rounded-full bg-[var(--color-bg-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-secondary)] transition-all duration-500"
                    style={{
                      width:
                        order.status === "COMPLETED"
                          ? "100%"
                          : order.status !== "ON_HOLD_PAYMENT"
                            ? `${Math.min(100, (30000 / Math.max(order.totalAmount, 1)) * 100)}%`
                            : "0%",
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <span>Đặt cọc</span>
                  <span
                    className={cn("font-medium", order.status !== "ON_HOLD_PAYMENT" && "text-[var(--color-success)]")}
                  >
                    30.000 ₫{" "}
                    {order.status !== "ON_HOLD_PAYMENT" ? "✓" : "(chờ)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Còn lại</span>
                  <span
                    className={cn("font-medium", order.status === "COMPLETED" && "text-[var(--color-success)]")}
                  >
                    {Math.max(0, order.totalAmount - 30000).toLocaleString("vi-VN")} ₫{" "}
                    {order.status === "COMPLETED" ? "✓" : ""}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Cancel button */}
          {["PENDING", "ON_HOLD_PAYMENT"].includes(order.status) && (
            <Button
              variant="danger"
              className="w-full"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling
                ? t("common.loading")
                : t("customer.orderDetail.cancelOrder")}
            </Button>
          )}

          {/* Review section */}
          {order.status === "REVIEW_PENDING" &&
            !order.rating &&
            !showReview && (
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20 bg-[var(--color-primary-soft)] p-5 animate-fade-up">
                <h3 className="font-semibold text-[var(--color-text)] mb-2">
                  Đánh giá dịch vụ
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  Đánh giá để tiến hành thanh toán phần còn lại.
                </p>
                <Button className="w-full" onClick={() => setShowReview(true)}>
                  {t("customer.orderDetail.writeReview")}
                </Button>
              </div>
            )}

          {showReview && (
            <Card className="animate-fade-up">
              <form onSubmit={handleReview}>
                <FormField label={t("customer.reviews.rating")}>
                  <StarRating value={rating} onChange={setRating} />
                </FormField>
                <FormField label={t("customer.reviews.comment")}>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FormField>
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={reviewing}
                >
                  {reviewing
                    ? t("common.loading")
                    : t("customer.reviews.submitReview")}
                </Button>
              </form>
            </Card>
          )}

          {order.rating != null && (
            <Card>
              <p className="text-sm font-medium text-[var(--color-text)] mb-2">Đánh giá của bạn</p>
              <StarRating value={order.rating} readonly />
              {order.review && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-2.5">
                  {order.review}
                </p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
