import Cookies from "js-cookie";
import { apiClient } from "@/services/api-client";

const VISITOR_COOKIE = "caremate-visitor";
const VISITOR_TTL_DAYS = 365;

export type PageKey = "landing" | "home";

/**
 * A random opaque id in a first-party cookie. It exists purely to tell "one
 * person reloading the landing page 20 times" apart from "20 people" — it holds
 * no personal data and is never sent anywhere except our own API.
 */
function getVisitorId(): string {
  let id = Cookies.get(VISITOR_COOKIE);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
    Cookies.set(VISITOR_COOKIE, id, {
      expires: VISITOR_TTL_DAYS,
      sameSite: "lax",
    });
  }
  return id;
}

/**
 * Fire-and-forget. Tracking must never break or delay a page render, so failures
 * are swallowed — a missing analytics row is not worth showing the user an error.
 */
export function trackPageView(page: PageKey): void {
  if (typeof window === "undefined") return;

  apiClient
    .post("/track/pageview", {
      visitorId: getVisitorId(),
      page,
      referrer: document.referrer ?? "",
    })
    .catch(() => {});
}
