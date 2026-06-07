export type UserRole = "customer" | "cleaner" | "admin";

export type OrderStatus =
  | "PENDING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "REVIEW_PENDING"
  | "COMPLETED"
  | "CANCELLED";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string | null;
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
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export interface OrderTask {
  taskCatalogId: string;
  taskName: string;
  taskPrice: number;
  isDone: boolean;
  photoBefore?: string | null;
  photoAfter?: string | null;
}

export interface Order {
  _id: string;
  customerId: string;
  customerName?: string;
  cleanerId?: string | null;
  cleanerName?: string | null;
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  note?: string | null;
  tasks: OrderTask[];
  photosBeforeBooking?: string[];
  photosCheckin?: string[];
  photosAfter?: string[];
  rating?: number | null;
  review?: string | null;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt?: string;
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
