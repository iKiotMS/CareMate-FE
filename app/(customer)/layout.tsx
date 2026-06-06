"use client";

import { PortalLayout } from "@/components/layout/PortalLayout";
import { customerNav } from "@/lib/navigation";
import { t } from "@/lib/i18n";
import { useAuthStore } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useApi";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  const storeUser = useAuthStore((s) => s.user);
  const displayName = user?.fullName ?? storeUser?.fullName ?? "Khách hàng";

  return (
    <PortalLayout
      navItems={customerNav}
      portalTitle={t("nav.customer.dashboard")}
      variant="customer"
      userName={displayName}
    >
      {children}
    </PortalLayout>
  );
}
