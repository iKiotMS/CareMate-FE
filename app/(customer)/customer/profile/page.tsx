"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { useUser } from "@/hooks/useApi";
import { useAuthStore } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function CustomerProfilePage() {
  const { data: user, isLoading } = useUser();
  const storeUser = useAuthStore((s) => s.user);
  const profile = user ?? storeUser;

  if (isLoading && !profile) {
    return (
      <p className="flex items-center gap-2 py-12">
        <Loader2 className="w-5 h-5 animate-spin" /> {t("common.loading")}
      </p>
    );
  }

  if (!profile) {
    return <p className="text-[var(--color-text-muted)]">{t("common.noData")}</p>;
  }

  return (
    <div>
      <PageHeader title={t("customer.profile.title")} />
      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-bold text-lg">{profile.fullName}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{profile.email}</p>
            </div>
          </div>
          <FormField label={t("auth.fullName")}>
            <Input defaultValue={profile.fullName} readOnly />
          </FormField>
          <FormField label={t("auth.phone")}>
            <Input defaultValue={profile.phone ?? ""} readOnly />
          </FormField>
          <FormField label={t("auth.email")}>
            <Input defaultValue={profile.email} disabled />
          </FormField>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Cập nhật hồ sơ sẽ có trong phiên bản sau.
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">{t("customer.profile.changePassword")}</h2>
          <FormField label={t("customer.profile.currentPassword")}>
            <Input type="password" disabled />
          </FormField>
          <FormField label={t("customer.profile.newPassword")}>
            <Input type="password" disabled />
          </FormField>
          <FormField label={t("customer.profile.confirmPassword")}>
            <Input type="password" disabled />
          </FormField>
          <Button variant="outline" disabled>
            {t("customer.profile.changePassword")}
          </Button>
        </Card>
      </div>
    </div>
  );
}
