import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

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
    enabled: typeof window !== "undefined",
  });
};

// ORDERS - Admin
export const useOrders = (filters?: any) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const response = await apiClient.get("/orders", { params: filters });
      return response.data;
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/orders/stats");
      return response.data;
    },
  });
};

// ORDERS - Mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/customers/orders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      apiClient.patch(`/orders/${orderId}/cancel`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, rating, comment }: any) =>
      apiClient.patch(`/orders/${orderId}/review`, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// ORDERS - Customer endpoints
export const useCustomerOrders = (status?: string) => {
  return useQuery({
    queryKey: ["customer", "orders", status],
    queryFn: async () => {
      const response = await apiClient.get("/customers/orders", {
        params: { status },
      });
      return response.data;
    },
  });
};

export const useCustomerOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ["customer", "orders", orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/customers/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
};

// ORDERS - Cleaner endpoints
export const useCleanerJobs = () => {
  return useQuery({
    queryKey: ["cleaner", "jobs"],
    queryFn: async () => {
      const response = await apiClient.get("/cleaner/jobs");
      return response.data;
    },
  });
};

export const useCleanerJobDetail = (jobId: string) => {
  return useQuery({
    queryKey: ["cleaner", "jobs", jobId],
    queryFn: async () => {
      const response = await apiClient.get(`/cleaner/jobs/${jobId}`);
      return response.data;
    },
    enabled: !!jobId,
  });
};

export const useCleanerWorkHistory = () => {
  return useQuery({
    queryKey: ["cleaner", "work-history"],
    queryFn: async () => {
      const response = await apiClient.get("/cleaner/work-history");
      return response.data;
    },
  });
};

// CLEANER MUTATIONS
export const useAvailableOrders = () => {
  return useQuery({
    queryKey: ["cleaner", "available-orders"],
    queryFn: async () => {
      const response = await apiClient.get("/cleaner/available-orders");
      return response.data;
    },
  });
};

export const useApplyForOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      apiClient.post(`/cleaner/available-orders/${orderId}/apply`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cleaner", "available-orders"],
      });
      queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs"] });
    },
  });
};

export const useAcceptJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) =>
      apiClient.patch(`/orders/${jobId}/accept`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs"] });
    },
  });
};

export const useCheckInJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, photos }: { jobId: string; photos: string[] }) =>
      apiClient.patch(`/orders/${jobId}/check-in`, { photosCheckin: photos }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs"] });
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
      apiClient.patch(`/orders/${jobId}/mark-task-done`, {
        taskCatalogId,
        photoBefore,
        photoAfter,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs"] });
    },
  });
};

export const useCompleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) =>
      apiClient.patch(`/orders/${jobId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaner", "jobs"] });
      queryClient.invalidateQueries({ queryKey: ["cleaner", "work-history"] });
    },
  });
};

// TASKS
export const useTaskCatalog = (activeOnly?: boolean) => {
  return useQuery({
    queryKey: ["tasks", { activeOnly }],
    queryFn: async () => {
      const response = await apiClient.get("/tasks", {
        params: activeOnly ? { activeOnly: "true" } : {},
      });
      return response.data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      apiClient.patch(`/tasks/${taskId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useToggleTaskActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      apiClient.patch(`/tasks/${taskId}/toggle`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// UPLOADS
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
