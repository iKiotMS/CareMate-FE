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

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className={cn("p-5 border-b border-[var(--color-sidebar-border)]", isCustomer && "bg-gradient-to-r from-[var(--color-gradient-from)]/10 to-transparent")}>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧹</span>
            <div>
              <p className="font-bold text-[var(--color-text)]">{t("app.name")}</p>
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-sidebar-active)] text-[var(--color-primary)]"
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
              <span className="text-sm font-medium text-[var(--color-text)] sm:hidden">
                {currentPageLabel}
              </span>
            )}
          </div>
          <ThemeToggle />
        </header>

        <main className={cn("flex-1 p-4 lg:p-6 overflow-auto", isCustomer && "max-w-6xl mx-auto w-full")}>
          {children}
        </main>
      </div>
    </div>
  );
}
