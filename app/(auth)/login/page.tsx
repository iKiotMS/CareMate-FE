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

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthApi();
  const setAuthSession = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const getErrorMessage = (err: any) =>
    err?.response?.data?.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ email, password });
      const { user: rawUser, accessToken, refreshToken } = response.data as {
        user: Record<string, unknown>;
        accessToken: string;
        refreshToken: string;
      };

      const user: User = {
        ...(rawUser as unknown as User),
        _id: String(rawUser._id ?? ""),
      };

      setAuthSession(user, accessToken, refreshToken);
      router.push(getDefaultRouteForRole(user.role));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Card padding="lg" className="shadow-[var(--shadow-lg)]">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">{t("auth.loginTitle")}</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">{t("auth.hint")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={t("auth.email")}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            required
            disabled={isLoading}
          />
        </FormField>
        <FormField label={t("auth.password")}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
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
          {isLoading ? "Đang đăng nhập..." : t("common.login")}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="text-[var(--color-primary)] font-medium hover:underline">
          {t("common.register")}
        </Link>
      </p>
    </Card>
  );
}
