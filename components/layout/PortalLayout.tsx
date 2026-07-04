"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  Star,
  Bell,
  User,
  Search,
  Briefcase,
  History,
  Wallet,
  Users,
  UserCog,
  ListChecks,
  MessageSquare,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { NavItem } from "@/types";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/shared/NotificationBell";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  Star,
  Bell,
  User,
  Search,
  Briefcase,
  History,
  Wallet,
  Users,
  UserCog,
  ListChecks,
  MessageSquare,
  BarChart3,
  Brain,
  Settings,
};

const customerBottomNavHrefs = ["/customer/dashboard", "/customer/orders", "/customer/book", "/customer/notifications", "/customer/profile"];

interface PortalLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  portalTitle: string;
  variant?: "customer" | "cleaner" | "admin";
  userName?: string;
}

export function PortalLayout({
  children,
  navItems,
  portalTitle,
  variant = "customer",
  userName = "Người dùng",
}: PortalLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCustomer = variant === "customer";
  const activeNavItem = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  const currentPageLabel = activeNavItem ? t(activeNavItem.labelKey) : "";

  const bottomNavItems = isCustomer
    ? customerBottomNavHrefs
        .map((href) => navItems.find((item) => item.href === href))
        .filter((item): item is NavItem => Boolean(item))
    : [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-[var(--shadow-lg)]" : "-translate-x-full",
        )}
      >
        <div className={cn("p-5 border-b border-[var(--color-sidebar-border)]", isCustomer && "bg-gradient-to-r from-[var(--color-primary-soft)] to-transparent")}>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-xl shadow-sm">
              🧹
            </span>
            <div>
              <p className="font-bold tracking-tight text-[var(--color-text)]">{t("app.name")}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{portalTitle}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] ?? LayoutDashboard;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-[var(--color-sidebar-active)] text-[var(--color-primary)] font-semibold"
                    : "text-[var(--color-sidebar-text)] hover:bg-[var(--color-surface-hover)]",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-sidebar-border)]">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <LogOut className="w-4 h-4" />
              {t("common.logout")}
            </Button>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {!sidebarOpen ? (
              <button
                type="button"
                aria-label="Mở menu điều hướng"
                className="lg:hidden p-2.5 -ml-1 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Đóng menu điều hướng"
                className="lg:hidden p-2.5 -ml-1 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <span className="text-sm text-[var(--color-text-secondary)] hidden sm:inline">
              Xin chào, <strong className="text-[var(--color-text)]">{userName}</strong>
            </span>
            {currentPageLabel && (
              <span className="text-sm font-semibold text-[var(--color-text)] sm:hidden">
                {currentPageLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isCustomer && <NotificationBell />}
            <ThemeToggle />
          </div>
        </header>

        <main
          className={cn(
            "flex-1 p-4 lg:p-6 overflow-auto",
            isCustomer && "max-w-6xl mx-auto w-full pb-24 lg:pb-6",
          )}
        >
          {children}
        </main>
      </div>

      {isCustomer && bottomNavItems.length > 0 && (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 px-1 pt-1.5 backdrop-blur-md safe-bottom lg:hidden">
          {bottomNavItems.map((item) => {
            const Icon = iconMap[item.icon] ?? LayoutDashboard;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const isPrimary = item.href === "/customer/book";

            if (isPrimary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-1 flex-col items-center gap-1 pb-1.5"
                >
                  <span className="-mt-6 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-white shadow-[0_8px_20px_-4px_var(--color-primary)] ring-4 ring-[var(--color-bg-elevated)] transition-transform active:scale-95">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--color-primary)]">{t(item.labelKey)}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "fill-[var(--color-primary-soft)]")} strokeWidth={active ? 2.5 : 2} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
