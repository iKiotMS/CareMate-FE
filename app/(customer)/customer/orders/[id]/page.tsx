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
import {
  AdjustmentList,
  DurationSummary,
} from "@/components/shared/AdjustmentList";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea, FormField } from "@/components/ui/Input";
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
import { AlertCircle, Loader2, UserCheck } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)]">
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
        className="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block"
      >
        ← {t("common.back")}
      </Link>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
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
            <h2 className="font-semibold mb-4">
              {t("customer.orderDetail.timeline")}
            </h2>
            <Timeline items={timeline} />
          </Card>

          {/* Applicants section — visible when PENDING and cleaners have applied */}
          {order.status === "PENDING" && pendingApplicants.length > 0 && (
            <Card>
              <h2 className="font-semibold mb-1">
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
                        "w-full text-left flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                        picked
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50",
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-[var(--color-primary)] font-medium text-sm shrink-0">
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
                        <UserCheck className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              <Button
                className="w-full mt-4"
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
            <div className="rounded-xl border border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)] text-center">
              Đang chờ nhân viên ứng tuyển... Bạn sẽ nhận được thông báo khi có
              ứng viên.
            </div>
          )}

          {/* Deposit QR — ON_HOLD_PAYMENT */}
          {order.status === "ON_HOLD_PAYMENT" && depositInfo && (
            <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold">Đặt cọc để xác nhận đơn</h2>
              </div>
              <CountdownTimer expiresAt={(depositInfo as any).expiresAt} />
              <div className="mt-4 text-center">
                <img
                  src={(depositInfo as any).qrDataUrl}
                  alt="QR đặt cọc"
                  className="mx-auto w-full max-w-[208px] aspect-square rounded-xl border"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm bg-white dark:bg-gray-900 rounded-lg p-4">
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
            <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/20">
              <h2 className="font-semibold mb-3">Thanh toán phần còn lại</h2>
              <div className="mb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Tổng dịch vụ
                  </span>
                  <span>
                    {Number((finalPaymentInfo as any).originalTotal)} ₫
                  </span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Đã đặt cọc</span>
                  <span>
                    − {Number((finalPaymentInfo as any).depositPaid)} ₫
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Còn lại</span>
                  <span className="text-[var(--color-primary)]">
                    {Number((finalPaymentInfo as any).amount)} ₫
                  </span>
                </div>
              </div>
              <div className="text-center">
                <img
                  src={(finalPaymentInfo as any).qrDataUrl}
                  alt="QR thanh toán cuối"
                  className="mx-auto w-full max-w-[208px] aspect-square rounded-xl border"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm bg-white dark:bg-gray-900 rounded-lg p-4">
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

          {/* Adjustments — the customer must resolve these before they can review. */}
          <AdjustmentList
            orderId={orderId}
            adjustments={order.adjustments ?? []}
            canResolve
          />

          {/* Actual vs booked working time */}
          {order.actualDurationMinutes != null && (
            <Card>
              <h2 className="font-semibold mb-3">
                {t("adjustment.actualDuration")}
              </h2>
              <DurationSummary
                bookedHours={order.durationHours}
                actualMinutes={order.actualDurationMinutes}
                varianceMinutes={order.durationVarianceMinutes}
              />
            </Card>
          )}

          {/* Tasks */}
          <Card>
            <h2 className="font-semibold mb-4">
              {t("customer.orderDetail.tasks")}
            </h2>
            <ul className="space-y-2">
              {order.tasks?.map((task, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  {task.taskName}
                  {task.isDone && <Badge variant="success">✓</Badge>}
                </li>
              ))}
            </ul>
          </Card>

          {(order.photosBeforeBooking?.length ?? 0) > 0 && (
            <Card>
              <h2 className="font-semibold mb-3">
                {t("customer.orderDetail.photosBefore")}
              </h2>
              <PhotoGrid photos={order.photosBeforeBooking} />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <p className="text-sm text-[var(--color-text-muted)]">
              {t("customer.orders.date")}
            </p>
            <p className="font-medium">
              {formatOrderDate(order.scheduledDate)} · {order.scheduledTime}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-3">
              Thời lượng
            </p>
            <p className="font-medium">
              {order.durationHours ?? "—"} giờ · {order.numCleaners ?? 1} nhân viên
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-3">
              {t("customer.orders.cleaner")}
            </p>
            <p className="font-medium">
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
              <p className="text-xs text-amber-600 mt-2">
                {pendingApplicants.length > 0
                  ? `${pendingApplicants.length} nhân viên đã ứng tuyển — hãy chọn 1 người`
                  : "Đang chờ nhân viên ứng tuyển..."}
              </p>
            )}
            {order.note && (
              <p className="text-sm mt-3 text-[var(--color-text-secondary)]">
                {order.note}
              </p>
            )}
          </Card>

          {/* Total */}
          <Card>
            <p className="text-sm text-[var(--color-text-muted)]">Tổng tiền</p>
            <p className="text-xl font-bold text-[var(--color-primary)]">
              {order.totalAmount} ₫
            </p>
            {[
              "ON_HOLD_PAYMENT",
              "CONFIRMED",
              "ACCEPTED",
              "IN_PROGRESS",
              "REVIEW_PENDING",
              "PAYMENT_PENDING",
            ].includes(order.status) && (
              <div className="mt-2 space-y-1 text-xs text-[var(--color-text-muted)]">
                <div className="flex justify-between">
                  <span>Đặt cọc</span>
                  <span
                    className={
                      order.status !== "ON_HOLD_PAYMENT" ? "text-green-600" : ""
                    }
                  >
                    30.000 ₫{" "}
                    {order.status !== "ON_HOLD_PAYMENT" ? "✓" : "(chờ)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Còn lại</span>
                  <span
                    className={
                      order.status === "COMPLETED" ? "text-green-600" : ""
                    }
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
              <div className="rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 p-4">
                <h3 className="font-semibold text-[var(--color-text)] mb-3">
                  Đánh giá dịch vụ
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">
                  Đánh giá để tiến hành thanh toán phần còn lại.
                </p>
                <Button className="w-full" onClick={() => setShowReview(true)}>
                  {t("customer.orderDetail.writeReview")}
                </Button>
              </div>
            )}

          {showReview && (
            <Card>
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
              <p className="text-sm font-medium mb-2">Đánh giá của bạn</p>
              <StarRating value={order.rating} readonly />
              {order.review && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
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
