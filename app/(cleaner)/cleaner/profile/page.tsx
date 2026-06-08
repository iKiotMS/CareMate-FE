"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { t } from "@/lib/i18n";
import { useUser, useUpdateProfile } from "@/hooks/useApi";

export default function CleanerProfilePage() {
  const { data: user, isLoading } = useUser();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const handleSave = async () => {
    await updateProfile.mutateAsync({ fullName, phone });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <PageHeader title={t("cleaner.profile.title")} />
      <Card className="max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--color-secondary-soft)] flex items-center justify-center text-xl">🧹</div>
          <div>
            <p className="font-bold">{user?.fullName}</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {user?.rating != null ? `${user.rating}★ · ` : ""}
              {user?.completedJobs != null ? `${user.completedJobs} việc` : ""}
            </p>
          </div>
        </div>
        <FormField label={t("auth.fullName")}>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </FormField>
        <FormField label={t("auth.phone")}>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormField>
        <FormField label={t("auth.email")}>
          <Input defaultValue={user?.email ?? ""} disabled />
        </FormField>
        <Button className="mt-2" onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Đang lưu..." : t("common.save")}
        </Button>
      </Card>
    </div>
  );
}
