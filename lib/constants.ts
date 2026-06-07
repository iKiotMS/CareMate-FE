import type { OrderStatus } from "@/types";

export const ORDER_STATUS_LABEL_KEYS: Record<OrderStatus, string> = {
  PENDING: "status.pending",
  ON_HOLD_PAYMENT: "status.onHoldPayment",
  CONFIRMED: "status.confirmed",
  ACCEPTED: "status.accepted",
  IN_PROGRESS: "status.inProgress",
  REVIEW_PENDING: "status.reviewPending",
  PAYMENT_PENDING: "status.paymentPending",
  COMPLETED: "status.completed",
  CANCELLED: "status.cancelled",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ ứng tuyển",
  ON_HOLD_PAYMENT: "Chờ đặt cọc",
  CONFIRMED: "Đã xác nhận",
  ACCEPTED: "Đã chấp nhận",
  IN_PROGRESS: "Đang dọn",
  REVIEW_PENDING: "Chờ đánh giá",
  PAYMENT_PENDING: "Chờ thanh toán",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
};

export const ORDER_STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "info" | "warning" | "success" | "danger" | "purple"
> = {
  PENDING: "warning",
  ON_HOLD_PAYMENT: "warning",
  CONFIRMED: "info",
  ACCEPTED: "info",
  IN_PROGRESS: "info",
  REVIEW_PENDING: "purple",
  PAYMENT_PENDING: "warning",
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
