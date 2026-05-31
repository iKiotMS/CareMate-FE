"use client";

import { PortalLayout } from "@/components/layout/PortalLayout";
import { adminNav } from "@/lib/navigation";
import { t } from "@/lib/i18n";
import { MOCK_USERS } from "@/data/mock";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayout
      navItems={adminNav}
      portalTitle={t("nav.admin.dashboard")}
      variant="admin"
      userName={MOCK_USERS.admin.fullName}
    >
      {children}
    </PortalLayout>
  );
}
