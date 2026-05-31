"use client";

import { PortalLayout } from "@/components/layout/PortalLayout";
import { cleanerNav } from "@/lib/navigation";
import { t } from "@/lib/i18n";
import { MOCK_USERS } from "@/data/mock";

export default function CleanerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalLayout
      navItems={cleanerNav}
      portalTitle={t("nav.cleaner.dashboard")}
      variant="cleaner"
      userName={MOCK_USERS.cleaner.fullName}
    >
      {children}
    </PortalLayout>
  );
}
