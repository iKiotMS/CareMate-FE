import type { OrderStatus } from "@/types";

export const ORDER_STATUS_LABEL_KEYS: Record<OrderStatus, string> = {
  PENDING: "status.pending",
  ASSIGNED: "status.assigned",
  ACCEPTED: "status.accepted",
  IN_PROGRESS: "status.inProgress",
  REVIEW_PENDING: "status.reviewPending",
  COMPLETED: "status.completed",
  CANCELLED: "status.cancelled",
};

export const ORDER_STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "info" | "warning" | "success" | "danger" | "purple"
> = {
  PENDING: "default",
  ASSIGNED: "info",
  ACCEPTED: "purple",
  IN_PROGRESS: "warning",
  REVIEW_PENDING: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export const TIME_SLOTS = [
  "07:00 - 09:00",
  "09:00 - 11:00",
  "11:00 - 13:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
];

export const PAYMENT_METHODS = [
  { id: "vnpay", name: "VNPay", description: "Thanh toán qua VNPay" },
  { id: "momo", name: "MoMo", description: "Ví điện tử MoMo" },
  { id: "stripe", name: "Stripe", description: "Thẻ quốc tế (Stripe)" },
];
