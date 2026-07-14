import { ecoServices } from "@/data/landing-content";

export function ServiceEcosystem() {
  // Nhân đôi danh sách để marquee cuộn vô tận, liền mạch.
  const items = [...ecoServices, ...ecoServices];

  return (
    <section id="services" className="py-20 bg-[var(--color-bg)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] leading-snug">
          Hệ sinh thái dịch vụ
          <br />
          trao cho gia đình cuộc sống thảnh thơi.
        </h2>
      </div>

      {/* group để hover tạm dừng animation */}
      <div className="group relative w-full">
        {/* Lớp mờ hai bên */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-32 z-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-32 z-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

        <div className="flex w-max animate-marquee-right gap-6 px-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {items.map((service, i) => (
            <article
              key={`${service.title}-${i}`}
              className="group/card relative w-[240px] sm:w-[280px] h-[320px] shrink-0 overflow-hidden rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <h3 className="absolute bottom-5 left-5 right-5 text-lg font-semibold text-white drop-shadow">
                {service.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
