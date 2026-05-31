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
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
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

export interface Complaint {
  _id: string;
  type: "customer" | "cleaner";
  subject: string;
  description: string;
  status: "open" | "investigating" | "resolved";
  createdAt: string;
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
