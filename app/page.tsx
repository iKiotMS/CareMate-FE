"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { vi } from "@/locales/vi";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock4,
  CheckCircle2,
  Building,
  CalendarDays,
  Shield,
  UserCheck,
  Star,
  Home,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  userCheck: UserCheck,
  star: Star,
  building: Building,
  calendarDays: CalendarDays,
  shield: Shield,
  clock4: Clock4,
  checkCircle2: CheckCircle2,
  sparkles: Sparkles,
  shieldCheck: ShieldCheck,
  arrowRight: ArrowRight,
};

const getIcon = (iconKey: string): LucideIcon => iconMap[iconKey] || Home;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <PublicHeader />

      <main className="overflow-hidden">
        <section className="relative">
          <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),transparent_40%)] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 py-20 lg:py-28 relative">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.95fr] items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Dịch vụ dọn dẹp chuyên nghiệp cho ngôi nhà của bạn
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                  Trải nghiệm dịch vụ dọn dẹp chất lượng cao, uy tín và tận tâm
                </h1>
                <p className="text-lg leading-8 text-[var(--color-text-secondary)] mb-10">
                  Giúp không gian sống của bạn luôn sạch sẽ và thoáng mát, từ
                  nhà riêng tới văn phòng, với đội ngũ chuyên nghiệp và dịch vụ
                  tận tâm.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button size="lg" className="gap-2">
                      Đặt lịch ngay
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -right-12 -bottom-10 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-gradient-to-br from-white via-slate-100 to-slate-50 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.2)]">
                  <Image
                    src="/images/screen.png"
                    alt="Screen preview"
                    width={512}
                    height={320}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              {vi.landing.stats.map((item) => {
                const Icon = getIcon(item.iconKey);
                return (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-sm)]"
                  >
                    <Icon className="w-10 h-10 text-[var(--color-primary)] mx-auto mb-4" />
                    <p className="text-3xl font-bold text-[var(--color-text)]">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="services" className="bg-[var(--color-bg-elevated)] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl mb-12">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-primary)] mb-3">
                Dịch vụ của chúng tôi
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
                Giải pháp dọn dẹp linh hoạt cho cả gia đình và văn phòng
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {vi.landing.services.map((service) => {
                const Icon = getIcon(service.iconKey);
                return (
                  <Card
                    key={service.title}
                    hover
                    padding="lg"
                    className="space-y-4"
                  >
                    <Icon className="w-10 h-10 text-[var(--color-primary)]" />
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {service.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-primary)] mb-3">
                Quy trình hoạt động
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-8">
                Ba bước đơn giản để ngôi nhà luôn sạch đẹp
              </h2>
              <div className="space-y-5">
                {vi.landing.steps.map((step) => {
                  const Icon = getIcon(step.iconKey);
                  return (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Card padding="lg" className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-primary)] mb-3">
                  Cam kết tin cậy
                </p>
                <h3 className="text-2xl font-semibold text-[var(--color-text)]">
                  An tâm mỗi lần dọn dẹp
                </h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Chúng tôi cam kết cung cấp dịch vụ minh bạch, nhân viên được đào
                tạo kỹ càng và quyền lợi hoàn tiền khi bạn không hài lòng.
              </p>
              <div className="space-y-4">
                {vi.landing.commitments.map((item) => {
                  const Icon = getIcon(item.iconKey);
                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
