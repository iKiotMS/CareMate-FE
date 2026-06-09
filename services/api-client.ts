import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";
import { resolveMock } from "./mock-interceptor";

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "https://care-mate-be.vercel.app";
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
      console.log(
        `[API] Request: ${config.method?.toUpperCase()} ${config.url}`,
      );
      if (config.data) {
        console.log(
          `[API] Body:`,
          JSON.stringify(config.data).substring(0, 100),
        );
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        console.log(
          `[API] Response: ${response.status} ${response.config.url}`,
        );
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        console.log(`[API] Error: ${error.response?.status} ${error.message}`);

        // ── Token refresh on 401 ─────────────────────────────────────────────
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log(`[API] 401 detected, attempting token refresh...`);
          originalRequest._retry = true;

          const refreshToken = Cookies.get("refreshToken");
          if (refreshToken) {
            try {
              console.log(`[API] Calling /auth/refresh...`);
              const response = await this.client.post("/auth/refresh", {
                refreshToken,
              });
              const newAccessToken = response.data.accessToken;
              console.log(`[API] Token refreshed successfully`);
              Cookies.set("accessToken", newAccessToken);

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              console.log(`[API] Token refresh failed, redirecting to login`);
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              window.location.href = "/login";
            }
          }
        }

        // ── Mock fallback for unimplemented BE endpoints ──────────────────────
        const status = error.response?.status;
        const isNotFound = status === 404;
        const isServerError = status === 500;
        const isNetworkError = !error.response && error.code !== "ECONNABORTED";

        if (
          (isNotFound || isServerError || isNetworkError) &&
          !originalRequest._mocked
        ) {
          console.log(
            `[API] Using mock response for ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
          );
          originalRequest._mocked = true;

          const mockData = resolveMock(
            originalRequest.method,
            originalRequest.url,
            originalRequest.data ? JSON.parse(originalRequest.data) : undefined,
          );

          if (mockData !== null) {
            console.info(
              `[mock] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
            );
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
