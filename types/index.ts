export type UserRole = "customer" | "cleaner" | "admin";

export type OrderStatus =
  | "PENDING"
  | "ON_HOLD_PAYMENT"
  | "CONFIRMED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "REVIEW_PENDING"
  | "PAYMENT_PENDING"
  | "COMPLETED"
  | "CANCELLED";

export interface UserAddress {
  _id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  email?: string;
  fullName: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string | null;
  addresses?: UserAddress[];
  isActive: boolean;
  rating?: number;
  completedJobs?: number;
}

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "E_WALLET";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export interface TaskCatalogItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface OrderTask {
  taskCatalogId: string;
  taskName: string;
  isDone: boolean;
  photoBefore?: string | null;
  photoAfter?: string | null;
}

export interface OrderApplicant {
  cleanerId: string;
  cleanerName?: string | null;
  cleanerAvatar?: string | null;
  cleanerRating?: number | null;
  completedJobs?: number;
  appliedAt: string;
  status: "PENDING" | "SELECTED" | "REJECTED";
}

export interface DepositInfo {
  paymentId: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  amount: number;
  content: string;
  qrDataUrl: string;
  expiresAt: string;
}

export interface FinalPaymentInfo extends DepositInfo {
  depositPaid: number;
  originalTotal: number;
}

export interface Order {
  _id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string | null;
  cleanerName?: string | null;
  cleanerIds?: string[];
  cleanerNames?: string[];
  pendingCleanerIds?: string[];
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  note?: string | null;
  tasks: OrderTask[];
  durationHours?: number;
  numCleaners?: number;
  areaM2?: number;
  photosBeforeBooking?: string[];
  photosCheckin?: string[];
  photosAfter?: string[];
  applicants?: OrderApplicant[];
  depositDeadline?: string | null;
  rating?: number | null;
  review?: string | null;

  // Actual execution window — set at check-in / completion.
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  actualDurationMinutes?: number | null;
  /** Negative = finished early (never refunded). Positive = overran. */
  durationVarianceMinutes?: number | null;

  adjustments?: OrderAdjustment[];
  /** Commissionable: base price + approved overtime. */
  serviceAmount?: number;
  /** Reimbursed to the cleaner at 100% — the platform takes no cut. */
  reimbursableAmount?: number;
  totalAmount: number;

  // Payout snapshot, frozen at COMPLETED.
  commissionRate?: number | null;
  platformCommission?: number | null;
  cleanerPayout?: number | null;

  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export type AdjustmentKind = "OVERTIME" | "EXPENSE";
export type AdjustmentStatus = "PENDING" | "APPROVED" | "REJECTED";

/**
 * A mid-job change to what the customer owes. OVERTIME is service revenue
 * (commissionable); EXPENSE is money the cleaner already paid out of pocket and
 * is reimbursed for in full.
 */
export interface OrderAdjustment {
  _id: string;
  kind: AdjustmentKind;
  label: string;
  amount: number;
  requestedBy: string;
  evidencePhoto?: string | null;
  overtimeMinutes?: number | null;
  status: AdjustmentStatus;
  resolvedAt?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
}

/** One cleaner's row in the admin payroll table. */
export interface CleanerSalary {
  cleanerId: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  totalOrders: number;
  /** Pay for work done, after the platform's cut. */
  serviceEarnings: number;
  /** Out-of-pocket costs paid back in full — not commissioned, not income. */
  reimbursements: number;
  netEarnings: number;
}

export interface TrafficStats {
  pages: { page: "landing" | "home"; views: number; uniqueVisitors: number }[];
  totalViews: number;
  /** Unique across all pages — NOT the sum of the per-page figures. */
  uniqueVisitors: number;
  daily: {
    date: string;
    views: number;
    pages: { page: string; views: number; uniqueVisitors: number }[];
  }[];
  logins: {
    total: number;
    uniqueUsers: number;
    failed: { reason: string; count: number }[];
    activeToday: number;
  };
  users: { total: number; newInRange: number };
}

/** Shared money breakdown returned by every admin financial endpoint. */
export interface FinancialBreakdown {
  grossBilled: number;
  serviceRevenue: number;
  reimbursements: number;
  commission: number;
  cleanerPayout: number;
  orders: number;
  currency: "VND";
}

export type NotificationType =
  | "ORDER_CREATED"
  | "CLEANER_ASSIGNED"
  | "CLEANER_CHECKED_IN"
  | "ORDER_COMPLETED"
  | "COMPLAINT_REPLIED"
  | "NEW_JOB_AVAILABLE"
  | "JOB_ASSIGNED"
  | "ORDER_CANCELLED"
  | "NEW_REVIEW_RECEIVED"
  | "NEW_COMPLAINT"
  | "LOW_RATING_ALERT"
  | "NEW_ORDER_CREATED"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_UNLOCKED";

export interface Notification {
  _id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
}

export interface Review {
  _id: string;
  orderId: string;
  customerName: string;
  cleanerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export type ComplaintStatus = "OPEN" | "PROCESSING" | "RESOLVED" | "REJECTED";
export type ComplaintCategory =
  | "SERVICE_QUALITY"
  | "CLEANER_BEHAVIOR"
  | "LATE_ARRIVAL"
  | "DAMAGE"
  | "OTHER";

export interface ComplaintReply {
  _id: string;
  authorId: string;
  authorName: string;
  authorRole: "customer" | "admin";
  message: string;
  createdAt: string;
}

export interface Complaint {
  _id: string;
  orderId: string;
  orderShortId: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  evidenceUrls: string[];
  status: ComplaintStatus;
  category: ComplaintCategory | null;
  replies: ComplaintReply[];
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
}

export interface EarningsSummary {
  thisWeek: number;
  thisMonth: number;
  totalJobs: number;
}

export interface IncomeSummary {
  totalNet: number;
  totalGross: number;
  totalCommission: number;
  ordersCount: number;
  period: "daily" | "weekly" | "monthly" | "all";
  from: string;
  to: string;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface CleanerPerformance {
  cleanerId: string;
  cleanerName: string;
  avatarUrl: string | null;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completionRate: number;
  cancellationRate: number;
  averageRating: number;
  totalReviews: number;
}

export interface AuditLog {
  _id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetId: string;
  targetType: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
