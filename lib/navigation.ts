import type { NavItem } from "@/types";

export const customerNav: NavItem[] = [
  { href: "/customer/dashboard", labelKey: "nav.customer.dashboard", icon: "LayoutDashboard" },
  { href: "/customer/book", labelKey: "nav.customer.book", icon: "Sparkles" },
  { href: "/customer/orders", labelKey: "nav.customer.orders", icon: "ClipboardList" },
  { href: "/customer/reviews", labelKey: "nav.customer.reviews", icon: "Star" },
  { href: "/customer/notifications", labelKey: "nav.customer.notifications", icon: "Bell" },
  { href: "/customer/profile", labelKey: "nav.customer.profile", icon: "User" },
];

export const cleanerNav: NavItem[] = [
  { href: "/cleaner/dashboard", labelKey: "nav.cleaner.dashboard", icon: "LayoutDashboard" },
  { href: "/cleaner/available-jobs", labelKey: "nav.cleaner.availableJobs", icon: "Search" },
  { href: "/cleaner/jobs", labelKey: "nav.cleaner.assignedJobs", icon: "Briefcase" },
  { href: "/cleaner/work-history", labelKey: "nav.cleaner.workHistory", icon: "History" },
  { href: "/cleaner/earnings", labelKey: "nav.cleaner.earnings", icon: "Wallet" },
  { href: "/cleaner/reviews", labelKey: "nav.cleaner.reviews", icon: "Star" },
  { href: "/cleaner/notifications", labelKey: "nav.cleaner.notifications", icon: "Bell" },
  { href: "/cleaner/profile", labelKey: "nav.cleaner.profile", icon: "User" },
];

export const adminNav: NavItem[] = [
  { href: "/admin/dashboard", labelKey: "nav.admin.dashboard", icon: "LayoutDashboard" },
  { href: "/admin/orders", labelKey: "nav.admin.orders", icon: "ClipboardList" },
  { href: "/admin/customers", labelKey: "nav.admin.customers", icon: "Users" },
  { href: "/admin/cleaners", labelKey: "nav.admin.cleaners", icon: "UserCog" },
  { href: "/admin/tasks", labelKey: "nav.admin.tasks", icon: "ListChecks" },
  { href: "/admin/reviews", labelKey: "nav.admin.reviews", icon: "Star" },
  { href: "/admin/complaints", labelKey: "nav.admin.complaints", icon: "MessageSquare" },
  { href: "/admin/analytics", labelKey: "nav.admin.analytics", icon: "BarChart3" },
  { href: "/admin/ai-center", labelKey: "nav.admin.aiCenter", icon: "Brain" },
  { href: "/admin/settings", labelKey: "nav.admin.settings", icon: "Settings" },
];
