import { CheckCircle2 } from "lucide-react";
import { CinematicIntro } from "./CinematicIntro";

const highlights = [
  { value: "98%", label: "Khách hàng hài lòng" },
  { value: "10+", label: "Nhân viên & cộng tác viên đồng hành" },
  { value: "200+", label: "Khách hàng tin dùng dịch vụ" },
  { value: "10.000+", label: "Giờ làm việc" },
];

export function JourneySection() {
  return (
    <section id="journey" className="py-20 bg-[var(--color-bg-elevated)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Hành trình của CareMate
          </h2>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Mang đến cho khách hàng dịch vụ chất lượng cao một cách thuận tiện và
            đúng hẹn.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] items-stretch">
          {/* Cột chỉ số */}
          <div className="space-y-4">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-xs)] transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">
                    {item.value}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Video giới thiệu CareMate (tự dựng, tự phát) */}
          <CinematicIntro />
        </div>
      </div>
    </section>
  );
}
