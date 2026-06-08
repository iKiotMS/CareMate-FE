"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-[var(--color-text)]">
          <span className="text-2xl">🧹</span>
          {t("app.name")}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">{t("common.login")}</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">{t("common.register")}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
