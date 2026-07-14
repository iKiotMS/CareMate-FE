"use client";

import { useEffect, useRef } from "react";
import { trackPageView, type PageKey } from "@/lib/tracking";

/**
 * Records one page view per mount.
 *
 * The ref guard matters: under React 18 StrictMode in development, effects run
 * twice, which would double-count every visit.
 */
export function usePageView(page: PageKey): void {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackPageView(page);
  }, [page]);
}
