"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/customer/dashboard");
  };

  return (
    <Card padding="lg" className="shadow-[var(--shadow-lg)]">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">{t("auth.registerTitle")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={t("auth.fullName")}>
          <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </FormField>
        <FormField label={t("auth.email")}>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label={t("auth.phone")}>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </FormField>
        <FormField label={t("auth.password")}>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
        <Button type="submit" className="w-full">{t("common.register")}</Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
          {t("common.login")}
        </Link>
      </p>
    </Card>
  );
}
