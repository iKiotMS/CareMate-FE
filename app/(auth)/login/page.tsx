"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, FormField } from "@/components/ui/Input";
import { t } from "@/lib/i18n";

const DEMO_ROLES = [
  { role: "customer", href: "/customer/dashboard", label: t("auth.roleCustomer") },
  { role: "cleaner", href: "/cleaner/dashboard", label: t("auth.roleCleaner") },
  { role: "admin", href: "/admin/dashboard", label: t("auth.roleAdmin") },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/customer/dashboard");
  };

  return (
    <Card padding="lg" className="shadow-[var(--shadow-lg)]">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">{t("auth.loginTitle")}</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">{t("auth.demoHint")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={t("auth.email")}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@caremate.vn" />
        </FormField>
        <FormField label={t("auth.password")}>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </FormField>
        <Button type="submit" className="w-full">{t("common.login")}</Button>
      </form>

      <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)] mb-3">Vào nhanh theo vai trò:</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ROLES.map((r) => (
            <Link key={r.role} href={r.href}>
              <Button variant="outline" size="sm">{r.label}</Button>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="text-[var(--color-primary)] font-medium hover:underline">
          {t("common.register")}
        </Link>
      </p>
    </Card>
  );
}
