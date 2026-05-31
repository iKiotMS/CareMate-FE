"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";
import { MOCK_USERS } from "@/data/mock";

export default function CleanerProfilePage() {
  const user = MOCK_USERS.cleaner;
  return (
    <div>
      <PageHeader title={t("cleaner.profile.title")} />
      <Card className="max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--color-secondary-soft)] flex items-center justify-center text-xl">🧹</div>
          <div>
            <p className="font-bold">{user.fullName}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{user.rating}★ · {user.completedJobs} việc</p>
          </div>
        </div>
        <FormField label={t("auth.fullName")}><Input defaultValue={user.fullName} /></FormField>
        <FormField label={t("auth.phone")}><Input defaultValue={user.phone} /></FormField>
        <FormField label={t("auth.email")}><Input defaultValue={user.email} disabled /></FormField>
        <Button className="mt-2">{t("common.save")}</Button>
      </Card>
    </div>
  );
}
