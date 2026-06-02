"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Timeline } from "@/components/shared/Timeline";
import { StarRating } from "@/components/shared/StarRating";
import { PhotoGrid } from "@/components/shared/Charts";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import {
  useCustomerOrderDetail,
  useCancelOrder,
  useSubmitReview,
} from "@/hooks/useApi";
import { formatOrderDate } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api-errors";
import type { Order, OrderStatus } from "@/types";
import { Loader2 } from "lucide-react";

export default function CustomerOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: orderRaw, isLoading, refetch } = useCustomerOrderDetail(params.id);
  const { mutateAsync: cancelOrder, isPending: cancelling } = useCancelOrder();
  const { mutateAsync: submitReview, isPending: reviewing } = useSubmitReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </p>
    );
  }

  const order = orderRaw as Order | undefined;
  if (!order) {
    return <div className="text-center py-12 text-[var(--color-text-muted)]">Không tìm thấy đơn hàng</div>;
  }

  const statusOrder = ["PENDING", "ASSIGNED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"];
  const currentIdx = statusOrder.indexOf(
    order.status === "REVIEW_PENDING" ? "COMPLETED" : order.status,
  );

  const timeline = [
    {
      key: "created",
      label: t("customer.timeline.created"),
      date: order.createdAt ? formatOrderDate(order.createdAt) : undefined,
      done: true,
    },
    {
      key: "assigned",
      label: t("customer.timeline.assigned"),
      done: currentIdx >= 1 || !!order.cleanerId,
    },
    { key: "accepted", label: t("customer.timeline.accepted"), done: currentIdx >= 2 },
    { key: "checkin", label: t("customer.timeline.checkin"), done: currentIdx >= 3 },
    {
      key: "completed",
      label: t("customer.timeline.completed"),
      done: order.status === "COMPLETED" || order.status === "REVIEW_PENDING",
      active: order.status === "REVIEW_PENDING",
    },
  ];

  const handleCancel = async () => {
    if (!confirm("Bạn chắc chắn muốn hủy đơn?")) return;
    setError("");
    try {
      await cancelOrder({ orderId: params.id });
      router.push("/customer/orders");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await submitReview({ orderId: params.id, rating, comment });
      setShowReview(false);
      refetch();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <Link href="/customer/orders" className="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">
        ← {t("common.back")}
      </Link>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <PageHeader
        title={t("customer.orderDetail.title")}
        subtitle={order.address}
        action={<OrderStatusBadge status={order.status as OrderStatus} />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-semibold mb-4">{t("customer.orderDetail.timeline")}</h2>
            <Timeline items={timeline} />
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">{t("customer.orderDetail.tasks")}</h2>
            <ul className="space-y-2">
              {order.tasks?.map((task, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  {task.taskName}
                  {task.isDone && <span className="text-[var(--color-success)] text-xs">✓</span>}
                </li>
              ))}
            </ul>
          </Card>

          {(order.photosBeforeBooking?.length ?? 0) > 0 && (
            <Card>
              <h2 className="font-semibold mb-3">{t("customer.orderDetail.photosBefore")}</h2>
              <PhotoGrid photos={order.photosBeforeBooking} />
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-sm text-[var(--color-text-muted)]">{t("customer.orders.date")}</p>
            <p className="font-medium">
              {formatOrderDate(order.scheduledDate)} · {order.scheduledTime}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-3">{t("customer.orders.cleaner")}</p>
            <p className="font-medium">
              {order.cleanerId ? "Đã có nhân viên nhận đơn" : t("customer.orders.notAssigned")}
            </p>
            {order.status === "PENDING" && (
              <p className="text-xs text-amber-600 mt-2">Đang chờ nhân viên ứng tuyển...</p>
            )}
            {order.note && (
              <p className="text-sm mt-3 text-[var(--color-text-secondary)]">{order.note}</p>
            )}
          </Card>

          {order.status === "PENDING" && (
            <Button variant="danger" className="w-full" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? t("common.loading") : t("customer.orderDetail.cancelOrder")}
            </Button>
          )}

          {order.status === "REVIEW_PENDING" && order.rating == null && !showReview && (
            <Button className="w-full" onClick={() => setShowReview(true)}>
              {t("customer.orderDetail.writeReview")}
            </Button>
          )}

          {showReview && (
            <Card>
              <form onSubmit={handleReview}>
                <FormField label={t("customer.reviews.rating")}>
                  <StarRating value={rating} onChange={setRating} />
                </FormField>
                <FormField label={t("customer.reviews.comment")}>
                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                </FormField>
                <Button type="submit" className="w-full mt-2" disabled={reviewing}>
                  {reviewing ? t("common.loading") : t("customer.reviews.submitReview")}
                </Button>
              </form>
            </Card>
          )}

          {order.rating != null && (
            <Card>
              <p className="text-sm font-medium mb-2">Đánh giá của bạn</p>
              <StarRating value={order.rating} readonly />
              {order.review && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">{order.review}</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
