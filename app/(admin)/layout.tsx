"use client";

import { PortalLayout } from "@/components/layout/PortalLayout";
import { adminNav } from "@/lib/navigation";
import { t } from "@/lib/i18n";
import { useAuthStore } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useApi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  const storeUser = useAuthStore((s) => s.user);
  const displayName = user?.fullName ?? storeUser?.fullName ?? "Admin";

  return (
    <PortalLayout
      navItems={adminNav}
      portalTitle={t("nav.admin.dashboard")}
      variant="admin"
      userName={displayName}
    >
      {children}
    </PortalLayout>
  );
}
