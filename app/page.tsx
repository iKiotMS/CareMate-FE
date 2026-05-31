"use client";

import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { Sparkles, Shield, BarChart3, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-gradient-to)]/5" />
        <div className="max-w-6xl mx-auto px-4 py-20 lg:py-28 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary-soft)] text-[var(--color-primary)] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Nền tảng dọn dẹp thông minh 2026
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text)] leading-tight mb-4">
              {t("landing.heroTitle")}
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              {t("landing.heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  {t("landing.ctaBook")} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">{t("landing.ctaLogin")}</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg">
            {[
              { val: "986+", label: t("landing.statsOrders") },
              { val: "24", label: t("landing.statsCleaners") },
              { val: "4.6★", label: t("landing.statsRating") },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 rounded-[var(--radius-xl)] glass">
                <p className="text-2xl font-bold text-gradient">{s.val}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: t("landing.feature1Title"), desc: t("landing.feature1Desc"), href: "/customer/dashboard", color: "primary" },
            { icon: Shield, title: t("landing.feature2Title"), desc: t("landing.feature2Desc"), href: "/cleaner/dashboard", color: "success" },
            { icon: BarChart3, title: t("landing.feature3Title"), desc: t("landing.feature3Desc"), href: "/admin/dashboard", color: "info" },
          ].map((f) => (
            <Card key={f.title} hover padding="lg" className="group">
              <f.icon className="w-10 h-10 text-[var(--color-primary)] mb-4" />
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{f.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-4">{f.desc}</p>
              <Link href={f.href} className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                Xem demo →
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
