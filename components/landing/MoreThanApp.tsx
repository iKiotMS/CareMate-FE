"use client";

import { useState } from "react";
import { appFeatures } from "@/data/landing-content";

export function MoreThanApp() {
  const [active, setActive] = useState(0);
  const current = appFeatures[active];

  return (
    <section id="about" className="py-20 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            <span className="text-[var(--color-primary)]">CareMate</span> không chỉ
            là một ứng dụng.
          </h2>
          <p className="mt-3 text-[var(--color-text-secondary)]">
            Mỗi giờ làm việc, mỗi ngôi nhà được chăm sóc… đều góp phần thay đổi cách
            xã hội nhìn nhận về nghề trợ giúp gia đình.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Danh sách — click để chuyển ảnh */}
          <div className="space-y-3">
            {appFeatures.map((feature, i) => {
              const isActive = i === active;
              return (
                <button
                  key={feature.key}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`w-full text-left rounded-[var(--radius-2xl)] border p-5 transition-all duration-300 ${
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-[var(--shadow-md)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        isActive
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-text)]">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ảnh lớn — đổi khi click */}
          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] shadow-[var(--shadow-lg)] aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.image}
              src={current.image}
              alt={current.title}
              className="animate-fade-in h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm uppercase tracking-widest text-white/70">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(appFeatures.length).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-2xl font-bold drop-shadow">
                {current.title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
