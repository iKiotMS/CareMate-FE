"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_var(--color-primary-soft),transparent_60%)]" />

      <div className="relative flex items-center justify-between p-4 max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[var(--color-text)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-lg shadow-sm">
            🧹
          </span>
          {t("app.name")}
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md animate-fade-up">
          {children}
        </div>
      </div>
    </div>
  );
}
