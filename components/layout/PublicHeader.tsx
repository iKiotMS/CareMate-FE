"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "Trang chủ", href: "#top" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Hành trình", href: "#journey" },
  { label: "Về chúng tôi", href: "#about" },
  { label: "Liên hệ", href: "#footer" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-[var(--color-text)] shrink-0"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-lg shadow-sm">
            🧹
          </span>
          {t("app.name")}
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[var(--color-text-secondary)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              {t("common.login")}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">{t("common.register")}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
