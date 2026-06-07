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

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  REVIEW_PENDING: "Awaiting Review",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "info" | "warning" | "success" | "danger" | "purple"
> = {
  PENDING: "warning",
  ASSIGNED: "info",
  ACCEPTED: "info",
  IN_PROGRESS: "info",
  REVIEW_PENDING: "purple",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export const PAYMENT_STATUS_VARIANT: Record<string, string> = {
  UNPAID: "warning",
  PAID: "success",
  REFUNDED: "info",
};

export const COMPLAINT_STATUS_VARIANT: Record<string, string> = {
  OPEN: "warning",
  PROCESSING: "info",
  RESOLVED: "success",
  REJECTED: "danger",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  E_WALLET: "E-Wallet",
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
