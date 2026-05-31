"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { MOCK_USERS } from "@/data/mock";

export default function CustomerProfilePage() {
  const user = MOCK_USERS.customer;

  return (
    <div>
      <PageHeader title={t("customer.profile.title")} />
      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-2xl">👤</div>
            <div>
              <p className="font-bold text-lg">{user.fullName}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
            </div>
          </div>
          <FormField label={t("auth.fullName")}>
            <Input defaultValue={user.fullName} />
          </FormField>
          <FormField label={t("auth.phone")}>
            <Input defaultValue={user.phone} />
          </FormField>
          <FormField label={t("auth.email")}>
            <Input defaultValue={user.email} disabled />
          </FormField>
          <Button className="mt-2">{t("common.save")}</Button>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">{t("customer.profile.changePassword")}</h2>
          <FormField label={t("customer.profile.currentPassword")}>
            <Input type="password" />
          </FormField>
          <FormField label={t("customer.profile.newPassword")}>
            <Input type="password" />
          </FormField>
          <FormField label={t("customer.profile.confirmPassword")}>
            <Input type="password" />
          </FormField>
          <Button variant="outline">{t("customer.profile.changePassword")}</Button>
        </Card>
      </div>
    </div>
  );
}
