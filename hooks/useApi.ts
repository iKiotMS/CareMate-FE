import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { apiClient } from "@/services/api-client";

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

/** Payload tạo đơn — khớp CreateOrderDto BE */
export interface CreateOrderPayload {
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  note?: string;
  taskIds: string[];
  photosBeforeBooking?: string[];
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
    mutationFn: (data: { name: string; slug: string; sortOrder?: number }) =>
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
