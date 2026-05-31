"use client";

import { PortalLayout } from "@/components/layout/PortalLayout";
import { customerNav } from "@/lib/navigation";
import { t } from "@/lib/i18n";
import { MOCK_USERS } from "@/data/mock";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayout
      navItems={customerNav}
      portalTitle={t("nav.customer.dashboard")}
      variant="customer"
      userName={MOCK_USERS.customer.fullName}
    >
      {children}
    </PortalLayout>
  );
}
