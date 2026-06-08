"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title={t("admin.settings.title")} />
      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl">
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.settings.general")}</h2>
          <FormField label="Tên hệ thống"><Input defaultValue="CareMate" /></FormField>
          <FormField label="Email hỗ trợ"><Input defaultValue="support@caremate.vn" /></FormField>
          <Button size="sm">{t("common.save")}</Button>
        </Card>
        <Card>
          <h2 className="font-semibold mb-4">{t("admin.settings.payment")}</h2>
          <FormField label="VNPay Merchant ID"><Input placeholder="—" disabled /></FormField>
          <FormField label="MoMo Partner Code"><Input placeholder="—" disabled /></FormField>
          <p className="text-xs text-[var(--color-text-muted)]">{t("common.comingSoon")}</p>
        </Card>
      </div>
    </div>
  );
}
