import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { apiClient } from "@/services/api-client";
import type {
  PaginatedResponse,
  Notification,
  Complaint,
  IncomeSummary,
} from "@/types";

const hasToken = () =>
  typeof window !== "undefined" && !!Cookies.get("accessToken");

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiClient.post("/auth/login", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
    }) => apiClient.post("/auth/register", data),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) =>
      apiClient.post("/auth/forgot-password", { email }),
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      forgotPasswordMutation.isPending,
  };
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
    enabled: hasToken(),
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fullName?: string; phone?: string; avatarUrl?: string | null }) =>
      apiClient.patch("/users/me", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

/** Payload tạo đơn — khớp CreateOrderDto BE */
export interface CreateOrderPayload {
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  note?: string;
  taskIds: string[];
  photosBeforeBooking?: string[];
  paymentMethod: "CASH" | "BANK_TRANSFER" | "E_WALLET";
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderPayload) =>
      apiClient.post("/customers/orders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["cleaner", "available-orders"] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      apiClient.patch(`/customers/orders/${orderId}/cancel`, { reason }),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "orders", orderId] });
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      rating,
      comment,
    }: {
      orderId: string;
      rating: number;
      comment?: string;
    }) =>
      apiClient.patch(`/customers/orders/${orderId}/review`, { rating, comment }),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "orders", orderId] });
    },
  });
};

export const useCustomerOrders = (status?: string) => {
  return useQuery({
    queryKey: ["customer", "orders", status ?? "ALL"],
    queryFn: async () => {
      const response = await apiClient.get("/customers/orders", {
        params: status && status !== "ALL" ? { status } : {},
      });
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useCustomerOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ["customer", "orders", orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/customers/orders/${orderId}`);
      return response.data;
    },
    enabled: hasToken() && !!orderId,
  });
};

export const useCleanerJobs = () => {
  return useQuery({
    queryKey: ["cleaner", "jobs"],
    queryFn: async () => {
      const response = await apiClient.get("/cleaner/jobs");
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useCleanerJobDetail = (jobId: string) => {
  return useQuery({
    queryKey: ["cleaner", "jobs", jobId],
    queryFn: async () => {
      const response = await apiClient.get(`/cleaner/jobs/${jobId}`);
      return response.data;
    },
    enabled: hasToken() && !!jobId,
  });
};

export const useAvailableOrders = () => {
  return useQuery({
    queryKey: ["cleaner", "available-orders"],
    queryFn: async () => {
      const response = await apiClient.get("/cleaner/available-orders");
      return response.data;
    },
    enabled: hasToken(),
    refetchInterval: 30_000,
  });
};

export const useApplyForOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      apiClient.post(`/cleaner/available-orders/${orderId}/apply`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaner", "available-orders"] });
      queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] });
    },
  });
};

export const useTaskCatalog = (activeOnly?: boolean) => {
  return useQuery({
    queryKey: ["tasks", { activeOnly: !!activeOnly }],
    queryFn: async () => {
      const response = await apiClient.get("/tasks", {
        params: activeOnly ? { activeOnly: "true" } : {},
      });
      return response.data;
    },
  });
};

export const useUploadPhotos = () => {
  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      return apiClient.post("/uploads/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
};

// ——— Admin / khác (giữ tương thích) ———

export const useOrders = (filters?: Record<string, string>) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const response = await apiClient.get("/orders", { params: filters });
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: hasToken() && !!orderId,
  });
};

const invalidateCleanerJob = (
  queryClient: ReturnType<typeof useQueryClient>,
  jobId: string,
) => {
  queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs"] });
  queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs", jobId] });
  queryClient.invalidateQueries({ queryKey: ["cleaner", "work-history"] });
};

export const useAcceptJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) =>
      apiClient.patch(`/cleaner/jobs/${jobId}/accept`, {}),
    onSuccess: (_data, jobId) => {
      invalidateCleanerJob(queryClient, jobId);
    },
  });
};

export const useCheckInJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, photos }: { jobId: string; photos: string[] }) =>
      apiClient.patch(`/cleaner/jobs/${jobId}/check-in`, { photosCheckin: photos }),
    onSuccess: (_data, { jobId }) => {
      invalidateCleanerJob(queryClient, jobId);
    },
  });
};

export const useMarkTaskDone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      taskCatalogId,
      photoBefore,
      photoAfter,
    }: {
      jobId: string;
      taskCatalogId: string;
      photoBefore?: string;
      photoAfter?: string;
    }) =>
      apiClient.patch(`/cleaner/jobs/${jobId}/mark-task-done`, {
        taskCatalogId,
        photoBefore,
        photoAfter,
      }),
    onSuccess: (_data, { jobId }) => {
      invalidateCleanerJob(queryClient, jobId);
    },
  });
};

export const useCompleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) =>
      apiClient.patch(`/cleaner/jobs/${jobId}/complete`, {}),
    onSuccess: (_data, jobId) => {
      invalidateCleanerJob(queryClient, jobId);
    },
  });
};

export const useCleanerWorkHistory = () => {
  return useQuery({
    queryKey: ["cleaner", "work-history"],
    queryFn: async () => {
      const response = await apiClient.get("/cleaner/work-history");
      return response.data;
    },
    enabled: hasToken(),
  });
};

// ——— Admin ———

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard/stats");
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useAdminCustomers = (search?: string, page = 1) => {
  return useQuery({
    queryKey: ["admin", "customers", { search, page }],
    queryFn: async () => {
      const response = await apiClient.get("/admin/customers", {
        params: { search: search || undefined, page, limit: 20 },
      });
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useAdminLockCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lock }: { id: string; lock: boolean }) =>
      apiClient.patch(`/admin/customers/${id}/${lock ? "lock" : "unlock"}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
  });
};

export const useAdminCleaners = (search?: string, page = 1) => {
  return useQuery({
    queryKey: ["admin", "cleaners", { search, page }],
    queryFn: async () => {
      const response = await apiClient.get("/admin/cleaners", {
        params: { search: search || undefined, page, limit: 20 },
      });
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useAdminCreateCleaner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      phone?: string;
      password: string;
    }) => apiClient.post("/admin/cleaners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cleaners"] });
    },
  });
};

export const useAdminLockCleaner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lock }: { id: string; lock: boolean }) =>
      apiClient.patch(`/admin/cleaners/${id}/${lock ? "lock" : "unlock"}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cleaners"] });
    },
  });
};

export const useAdminOrders = (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["admin", "orders", filters],
    queryFn: async () => {
      const response = await apiClient.get("/admin/orders", {
        params: {
          status: filters?.status || undefined,
          page: filters?.page ?? 1,
          limit: filters?.limit ?? 50,
        },
      });
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useAdminAssignCleaner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, cleanerId }: { orderId: string; cleanerId: string }) =>
      apiClient.patch(`/admin/orders/${orderId}/assign-cleaner`, { cleanerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

export const useAdminReassignCleaner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, cleanerId }: { orderId: string; cleanerId: string }) =>
      apiClient.patch(`/admin/orders/${orderId}/reassign-cleaner`, { cleanerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
};

export const useAdminCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      apiClient.patch(`/admin/orders/${orderId}/cancel`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

export const useAdminTasks = () => {
  return useQuery({
    queryKey: ["admin", "tasks"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/tasks");
      return response.data;
    },
    enabled: hasToken(),
  });
};

export const useAdminCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string; price: number; sortOrder?: number }) =>
      apiClient.post("/admin/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useAdminToggleTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      apiClient.patch(`/admin/tasks/${taskId}/toggle`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export function useMyNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<Notification>>(`/notifications?page=${page}&limit=${limit}`)
        .then((r) => r.data),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () =>
      apiClient
        .get<{ count: number }>("/notifications/unread-count")
        .then((r) => r.data),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      apiClient.patch("/notifications/read", { ids }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.patch("/notifications/read-all").then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLAINTS — CUSTOMER
// ─────────────────────────────────────────────────────────────────────────────
export function useMyComplaints(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["complaints", page, limit],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<Complaint>>(`/complaints?page=${page}&limit=${limit}`)
        .then((r) => r.data),
  });
}

export function useMyComplaintById(id: string) {
  return useQuery({
    queryKey: ["complaints", id],
    queryFn: () => apiClient.get<Complaint>(`/complaints/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      orderId: string;
      subject: string;
      description: string;
      evidenceUrls?: string[];
    }) => apiClient.post<Complaint>("/complaints", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["complaints"] }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLAINTS — ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export function useAdminComplaints(
  filters: { status?: string; category?: string; page?: number; limit?: number } = {},
) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 20));

  return useQuery({
    queryKey: ["admin", "complaints", filters],
    queryFn: () =>
      apiClient
        .get<PaginatedResponse<Complaint>>(`/admin/complaints?${params}`)
        .then((r) => r.data),
  });
}

export function useAdminComplaintById(id: string) {
  return useQuery({
    queryKey: ["admin", "complaints", id],
    queryFn: () =>
      apiClient.get<Complaint>(`/admin/complaints/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useAdminUpdateComplaintStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, category }: { id: string; status: string; category?: string }) =>
      apiClient
        .patch(`/admin/complaints/${id}/status`, { status, category })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "complaints"] }),
  });
}

export function useAdminReplyComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      apiClient
        .post(`/admin/complaints/${id}/reply`, { message })
        .then((r) => r.data),
    onSuccess: (_: unknown, { id }: { id: string; message: string }) => {
      qc.invalidateQueries({ queryKey: ["admin", "complaints", id] });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INCOME — CLEANER
// ─────────────────────────────────────────────────────────────────────────────
export function useMyIncomeSummary(period: "daily" | "weekly" | "monthly" | "all" = "monthly") {
  return useQuery({
    queryKey: ["income", "summary", period],
    queryFn: () =>
      apiClient
        .get<IncomeSummary>(`/income/summary?period=${period}`)
        .then((r) => r.data),
  });
}

export function useMyIncomeByOrder(
  filters: { from?: string; to?: string; page?: number } = {},
) {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  params.set("page", String(filters.page ?? 1));

  return useQuery({
    queryKey: ["income", "orders", filters],
    queryFn: () =>
      apiClient
        .get(`/income/by-order?${params}`)
        .then((r) => r.data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS — CLEANER
// ─────────────────────────────────────────────────────────────────────────────
export function useMyRatingAnalytics() {
  return useQuery({
    queryKey: ["cleaner", "analytics", "ratings"],
    queryFn: () =>
      apiClient.get("/cleaner/analytics/ratings").then((r) => r.data),
  });
}

export function useMyReceivedReviews(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["cleaner", "reviews", page],
    queryFn: () =>
      apiClient
        .get(`/cleaner/analytics/reviews?page=${page}&limit=${limit}`)
        .then((r) => r.data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS — ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export function useAdminRatingAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics", "ratings"],
    queryFn: () =>
      apiClient.get("/admin/analytics/ratings").then((r) => r.data),
  });
}

export function useAdminCleanerPerformance(
  sortBy: "rating" | "completionRate" | "totalOrders" = "rating",
  page = 1,
) {
  return useQuery({
    queryKey: ["admin", "analytics", "cleaners", sortBy, page],
    queryFn: () =>
      apiClient
        .get(`/admin/analytics/cleaners?sortBy=${sortBy}&page=${page}`)
        .then((r) => r.data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// REVENUE — ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export function useRevenueDashboard() {
  return useQuery({
    queryKey: ["admin", "revenue", "dashboard"],
    queryFn: () =>
      apiClient.get("/admin/revenue/dashboard").then((r) => r.data),
  });
}

export function useAdminPaymentStats(from?: string, to?: string) {
  return useQuery({
    queryKey: ["admin", "payments", "stats", from, to],
    queryFn: () => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      return apiClient.get(`/admin/payments/stats?${params}`).then((r) => r.data);
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// AVAILABILITY — CLEANER
// ─────────────────────────────────────────────────────────────────────────────
export function useMyAvailability() {
  return useQuery({
    queryKey: ["cleaner", "availability"],
    queryFn: () =>
      apiClient.get("/cleaner/availability").then((r) => r.data),
  });
}

export function useUpdateAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      workingDays?: number[];
      workingHours?: { start: string; end: string };
      daysOff?: string[];
    }) => apiClient.put("/cleaner/availability", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cleaner", "availability"] }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARDS
// ─────────────────────────────────────────────────────────────────────────────
export function useCustomerDashboard() {
  return useQuery({
    queryKey: ["customer", "dashboard"],
    queryFn: () => apiClient.get("/customers/dashboard").then((r) => r.data),
  });
}

export function useCleanerDashboard() {
  return useQuery({
    queryKey: ["cleaner", "dashboard"],
    queryFn: () => apiClient.get("/cleaner/dashboard").then((r) => r.data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS — ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export function useAdminReviews(filters: { minRating?: number; maxRating?: number; page?: number; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (filters.minRating !== undefined) params.set("minRating", String(filters.minRating));
  if (filters.maxRating !== undefined) params.set("maxRating", String(filters.maxRating));
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 20));

  return useQuery({
    queryKey: ["admin", "reviews", filters],
    queryFn: () => apiClient.get(`/admin/reviews?${params}`).then((r) => r.data),
    enabled: hasToken(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────────────────────────────────────
export function useCalculateOrderTotal() {
  return useMutation({
    mutationFn: (taskIds: string[]) =>
      apiClient
        .post<{ tasks: { taskId: string; taskName: string; price: number }[]; totalAmount: number }>(
          "/tasks/calculate-total",
          { taskIds },
        )
        .then((r) => r.data),
  });
}
