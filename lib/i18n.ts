import { vi } from "@/locales/vi";

type NestedRecord = { [key: string]: string | NestedRecord };

function getNestedValue(obj: NestedRecord, path: string): string {
  const parts = path.split(".");
  let current: string | NestedRecord = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return path;
    current = current[part];
  }
  return typeof current === "string" ? current : path;
}

export function t(key: string, params?: Record<string, string | number>): string {
  let text = getNestedValue(vi as NestedRecord, key);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export function useT() {
  return { t };
}
