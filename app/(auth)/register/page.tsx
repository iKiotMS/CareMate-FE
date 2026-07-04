"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Phone, User as UserIcon } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
        phone: form.phone,
        password: form.password,
      };

      await register(payload);
      const response = await login({ phone: form.phone, password: form.password });
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
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] mb-1.5">{t("auth.registerTitle")}</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-7">{t("auth.hint")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={t("auth.fullName")}>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder={t("auth.fullNamePlaceholder")}
              required
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </FormField>
        <FormField label={t("auth.phone")}>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t("auth.phoneNumberPlaceholder")}
              required
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </FormField>
        <FormField label={t("auth.password")}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t("auth.passwordPlaceholder")}
              required
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>
        {error ? (
          <p className="animate-fade-in rounded-[var(--radius-md)] bg-[var(--color-danger-soft)] px-3.5 py-2.5 text-sm font-medium text-[var(--color-danger)]">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          {isLoading ? "Đang đăng ký..." : t("common.register")}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-7">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
          {t("common.login")}
        </Link>
      </p>
    </Card>
  );
}
