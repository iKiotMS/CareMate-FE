"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 font-bold text-[var(--color-text)]">
          <span className="text-xl">🧹</span>
          {t("app.name")}
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
