import { vi } from "@/locales/vi";

type TranslationNode =
  | string
  | readonly unknown[]
  | { readonly [key: string]: TranslationNode };

function getNestedValue(obj: TranslationNode, path: string): string {
  const parts = path.split(".");
  let current: TranslationNode = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return path;
    }
    current = (current as { readonly [key: string]: TranslationNode })[part];
  }
  return typeof current === "string" ? current : path;
}

export function t(key: string, params?: Record<string, string | number>): string {
  let text = getNestedValue(vi, key);
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
