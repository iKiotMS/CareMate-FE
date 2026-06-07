/**
 * Mock interceptor for BE endpoints not yet implemented.
 * Called by the Axios error interceptor in api-client.ts.
 *
 * Returns mock data for 404 / network errors on specific URL patterns.
 * When the real BE endpoint goes live, it will respond with 200 and this
 * code is never reached.
 */

import {
  MOCK_NOTIFICATION_LIST,
  MOCK_UNREAD_COUNT,
  MOCK_COMPLAINT_LIST,
  MOCK_COMPLAINT_DETAIL,
  makeMockComplaint,
  MOCK_INCOME_SUMMARY,
  MOCK_INCOME_BY_ORDER,
  MOCK_CLEANER_RATING_ANALYTICS,
  MOCK_CLEANER_RECEIVED_REVIEWS,
  MOCK_ADMIN_RATING_ANALYTICS,
  MOCK_CLEANER_PERFORMANCE,
  MOCK_REVENUE_DASHBOARD,
  MOCK_PAYMENT_STATS,
  MOCK_AVAILABILITY,
  MOCK_CUSTOMER_DASHBOARD,
  MOCK_CLEANER_DASHBOARD,
  makeMockCalculateTotal,
  MOCK_AUDIT_LOGS,
} from "@/data/mock-responses";

type MockResult = unknown | null;

/** Returns mock data if the request matches an unimplemented endpoint, else null. */
export function resolveMock(
  method: string | undefined,
  url: string | undefined,
  body?: unknown,
): MockResult {
  if (!method || !url) return null;

  const m = method.toLowerCase();
  // Strip query params for pattern matching
  const path = url.split("?")[0].replace(/^\//, "");

  // ── Notifications ──────────────────────────────────────────────────────────
  if (m === "get" && path === "notifications") return MOCK_NOTIFICATION_LIST;
  if (m === "get" && path === "notifications/unread-count") return MOCK_UNREAD_COUNT;
  if (m === "patch" && path === "notifications/read") return { success: true };
  if (m === "patch" && path === "notifications/read-all") return { success: true };

  // ── Complaints (Customer) ──────────────────────────────────────────────────
  if (m === "get" && path === "complaints") return MOCK_COMPLAINT_LIST;
  if (m === "post" && path === "complaints") return makeMockComplaint(body ?? {});
  if (m === "get" && /^complaints\/[^/]+$/.test(path)) return MOCK_COMPLAINT_DETAIL;

  // ── Complaints (Admin) ─────────────────────────────────────────────────────
  if (m === "get"  && path === "admin/complaints") return MOCK_COMPLAINT_LIST;
  if (m === "get"  && /^admin\/complaints\/[^/]+$/.test(path)) return MOCK_COMPLAINT_DETAIL;
  if (m === "patch" && /^admin\/complaints\/[^/]+\/status$/.test(path)) return { success: true };
  if (m === "post"  && /^admin\/complaints\/[^/]+\/reply$/.test(path))  return { success: true };

  // ── Income (Cleaner) ───────────────────────────────────────────────────────
  if (m === "get" && path === "income/summary")   return MOCK_INCOME_SUMMARY;
  if (m === "get" && path === "income/by-order")  return MOCK_INCOME_BY_ORDER;

  // ── Analytics (Cleaner) ────────────────────────────────────────────────────
  if (m === "get" && path === "cleaner/analytics/ratings") return MOCK_CLEANER_RATING_ANALYTICS;
  if (m === "get" && path === "cleaner/analytics/reviews") return MOCK_CLEANER_RECEIVED_REVIEWS;

  // ── Analytics (Admin) ─────────────────────────────────────────────────────
  if (m === "get" && path === "admin/analytics/ratings")  return MOCK_ADMIN_RATING_ANALYTICS;
  if (m === "get" && path === "admin/analytics/cleaners") return MOCK_CLEANER_PERFORMANCE;

  // ── Revenue / Payments (Admin) ─────────────────────────────────────────────
  if (m === "get" && path === "admin/revenue/dashboard") return MOCK_REVENUE_DASHBOARD;
  if (m === "get" && path === "admin/payments/stats")    return MOCK_PAYMENT_STATS;

  // ── Availability (Cleaner) ─────────────────────────────────────────────────
  if (m === "get" && path === "cleaner/availability") return MOCK_AVAILABILITY;
  if (m === "put" && path === "cleaner/availability") return { success: true };

  // ── Dashboards ─────────────────────────────────────────────────────────────
  if (m === "get" && path === "customers/dashboard") return MOCK_CUSTOMER_DASHBOARD;
  if (m === "get" && path === "cleaner/dashboard")   return MOCK_CLEANER_DASHBOARD;

  // ── Pricing ────────────────────────────────────────────────────────────────
  if (m === "post" && path === "tasks/calculate-total") {
    const taskIds = (body as any)?.taskIds ?? [];
    return makeMockCalculateTotal(taskIds);
  }

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  if (m === "get" && path === "admin/audit-logs") return MOCK_AUDIT_LOGS;

  return null;
}
