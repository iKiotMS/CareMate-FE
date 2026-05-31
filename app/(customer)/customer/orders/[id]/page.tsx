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
import { getOrderById, formatDate } from "@/data/mock";
import type { OrderStatus } from "@/types";

export default function CustomerOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const order = getOrderById(params.id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showReview, setShowReview] = useState(false);

  if (!order) {
    return <div className="text-center py-12 text-[var(--color-text-muted)]">Không tìm thấy đơn hàng</div>;
  }

  const statusOrder = ["PENDING", "ASSIGNED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"];
  const currentIdx = statusOrder.indexOf(order.status === "REVIEW_PENDING" ? "COMPLETED" : order.status);

  const timeline = [
    { key: "created", label: t("customer.timeline.created"), date: formatDate(order.createdAt), done: true },
    { key: "assigned", label: t("customer.timeline.assigned"), done: currentIdx >= 1 },
    { key: "accepted", label: t("customer.timeline.accepted"), done: currentIdx >= 2 },
    { key: "checkin", label: t("customer.timeline.checkin"), done: currentIdx >= 3 },
    { key: "completed", label: t("customer.timeline.completed"), done: order.status === "COMPLETED" || order.status === "REVIEW_PENDING", active: order.status === "REVIEW_PENDING" },
  ];

  return (
    <div>
      <Link href="/customer/orders" className="text-sm text-[var(--color-primary)] hover:underline mb-4 inline-block">← {t("common.back")}</Link>
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
              {order.tasks.map((task, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center text-xs">{i + 1}</span>
                  {task.taskName}
                  {task.isDone && <span className="text-[var(--color-success)] text-xs">✓</span>}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-semibold mb-3">{t("customer.orderDetail.photosBefore")}</h2>
            <PhotoGrid photos={order.photosBeforeBooking} />
          </Card>
          {(order.photosCheckin?.length ?? 0) > 0 && (
            <Card>
              <h2 className="font-semibold mb-3">{t("customer.orderDetail.photosCheckin")}</h2>
              <PhotoGrid photos={order.photosCheckin} />
            </Card>
          )}
          {(order.photosAfter?.length ?? 0) > 0 && (
            <Card>
              <h2 className="font-semibold mb-3">{t("customer.orderDetail.photosAfter")}</h2>
              <PhotoGrid photos={order.photosAfter} />
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-sm text-[var(--color-text-muted)]">{t("customer.orders.date")}</p>
            <p className="font-medium">{formatDate(order.scheduledDate)} · {order.scheduledTime}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-3">{t("customer.orders.cleaner")}</p>
            <p className="font-medium">{order.cleanerName ?? t("customer.orders.notAssigned")}</p>
            {order.note && <p className="text-sm mt-3 text-[var(--color-text-secondary)]">{order.note}</p>}
          </Card>

          {order.status === "PENDING" && (
            <Button variant="danger" className="w-full" onClick={() => router.push("/customer/orders")}>
              {t("customer.orderDetail.cancelOrder")}
            </Button>
          )}

          {order.status === "REVIEW_PENDING" && !showReview && (
            <Button className="w-full" onClick={() => setShowReview(true)}>{t("customer.orderDetail.writeReview")}</Button>
          )}

          {showReview && (
            <Card>
              <FormField label={t("customer.reviews.rating")}>
                <StarRating value={rating} onChange={setRating} />
              </FormField>
              <FormField label={t("customer.reviews.comment")}>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
              </FormField>
              <Button className="w-full mt-2" onClick={() => { alert("Đã gửi đánh giá!"); setShowReview(false); }}>
                {t("customer.reviews.submitReview")}
              </Button>
            </Card>
          )}

          {order.rating && (
            <Card>
              <p className="text-sm font-medium mb-2">Đánh giá của bạn</p>
              <StarRating value={order.rating} readonly />
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">{order.review}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
