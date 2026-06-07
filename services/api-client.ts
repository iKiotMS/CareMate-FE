import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";
import { resolveMock } from "./mock-interceptor";

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // ── Token refresh on 401 ─────────────────────────────────────────────
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = Cookies.get("refreshToken");
          if (refreshToken) {
            try {
              const response = await this.client.post("/auth/refresh", {
                refreshToken,
              });
              const newAccessToken = response.data.accessToken;
              Cookies.set("accessToken", newAccessToken);

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            } catch {
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              window.location.href = "/login";
            }
          }
        }

        // ── Mock fallback for unimplemented BE endpoints ──────────────────────
        // Triggered when BE returns 404 or the server is unreachable (network error).
        // Once the real endpoint is live, it returns 200 and this block is skipped.
        const status = error.response?.status;
        const isNotFound = status === 404;
        const isServerError = status === 500;
        const isNetworkError = !error.response && error.code !== "ECONNABORTED";

        if ((isNotFound || isServerError || isNetworkError) && !originalRequest._mocked) {
          originalRequest._mocked = true;

          const mockData = resolveMock(
            originalRequest.method,
            originalRequest.url,
            originalRequest.data ? JSON.parse(originalRequest.data) : undefined,
          );

          if (mockData !== null) {
            console.info(`[mock] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`);
            return Promise.resolve({
              data: mockData,
              status: 200,
              statusText: "OK (mock)",
              headers: {},
              config: originalRequest,
            });
          }
        }

        return Promise.reject(error);
      },
    );
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
