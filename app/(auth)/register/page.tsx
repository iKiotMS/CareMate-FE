"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { useAuth as useAuthApi } from "@/hooks/useApi";
import { useAuthStore } from "@/hooks/useAuth";
import { t } from "@/lib/i18n";
import { getDefaultRouteForRole } from "@/lib/navigation";
import type { User } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { login, register, isLoading } = useAuthApi();
  const setAuthSession = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const getErrorMessage = (err: any) => {
    const message = err?.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    return message || "Đăng ký không thành công. Vui lòng thử lại.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      };

      await register(payload);
      const response = await login({ email: form.email, password: form.password });
      const { user, accessToken, refreshToken } = response.data as {
        user: User;
        accessToken: string;
        refreshToken: string;
      };

      setAuthSession(user, accessToken, refreshToken);
      router.push(getDefaultRouteForRole(user.role));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Card padding="lg" className="shadow-[var(--shadow-lg)]">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">{t("auth.registerTitle")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={t("auth.fullName")}>
          <Input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
            disabled={isLoading}
          />
        </FormField>
        <FormField label={t("auth.email")}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </FormField>
        <FormField label={t("auth.phone")}>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={isLoading}
          />
        </FormField>
        <FormField label={t("auth.password")}>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </FormField>
        {error ? (
          <p className="rounded-[var(--radius-md)] bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang đăng ký..." : t("common.register")}
        </Button>
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
