import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { ServiceEcosystem } from "@/components/landing/ServiceEcosystem";
import { JourneySection } from "@/components/landing/JourneySection";
import { MoreThanApp } from "@/components/landing/MoreThanApp";
import { usePageView } from "@/hooks/usePageView";

export default function LandingPage() {
  usePageView("landing");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <PublicHeader />

      <main className="overflow-hidden">
        {/* 1. Banner carousel */}
        <HeroCarousel />

        {/* 2. Hệ sinh thái dịch vụ — marquee cuộn sang phải */}
        <ServiceEcosystem />

        {/* 3. Hành trình 10 năm — kèm video giới thiệu */}
        <JourneySection />

        {/* 4. CareMate không chỉ là một ứng dụng — click đổi ảnh */}
        <MoreThanApp />
      </main>

      {/* 5. Footer — thông tin liên hệ */}
      <PublicFooter />
    </div>
  );
}
