"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { heroSlides } from "@/data/landing-content";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const count = heroSlides.length;

  const go = useCallback(
    (next: number) => setIndex((prev) => (next + count) % count),
    [count],
  );

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section id="top" className="relative">
      <div className="relative h-[440px] sm:h-[540px] lg:h-[600px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-premium ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />

            <div className="absolute inset-0">
              <div className="max-w-6xl mx-auto px-4 h-full flex items-center">
                <div
                  className={`max-w-xl text-white ${
                    i === index ? "animate-fade-up" : ""
                  }`}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow">
                    {slide.title}{" "}
                    <span className="text-[var(--color-primary)]">
                      {slide.highlight}
                    </span>
                  </h1>
                  <p className="mt-5 text-lg sm:text-xl text-white/90 max-w-lg leading-8">
                    {slide.subtitle}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/register">
                      <Button size="xl" className="gap-2">
                        Đặt lịch ngay
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        size="xl"
                        variant="outline"
                        className="!bg-white/10 !border-white/60 !text-white hover:!bg-white/20"
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Nút điều hướng */}
        <button
          type="button"
          aria-label="Ảnh trước"
          onClick={() => go(index - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/85 text-slate-800 grid place-items-center shadow-lg hover:bg-white transition active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Ảnh tiếp theo"
          onClick={() => go(index + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/85 text-slate-800 grid place-items-center shadow-lg hover:bg-white transition active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Chấm chỉ báo */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Chuyển đến ảnh ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
