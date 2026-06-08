"use client";

import { PortalLayout } from "@/components/layout/PortalLayout";
import { cleanerNav } from "@/lib/navigation";
import { t } from "@/lib/i18n";
import { useAuthStore } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useApi";

export default function CleanerLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  const storeUser = useAuthStore((s) => s.user);
  const displayName = user?.fullName ?? storeUser?.fullName ?? "Nhân viên dọn";

  return (
    <PortalLayout
      navItems={cleanerNav}
      portalTitle={t("nav.cleaner.dashboard")}
      variant="cleaner"
      userName={displayName}
    >
      {children}
    </PortalLayout>
  );
}
