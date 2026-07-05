import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const companyLinks = [
  { label: "Về CareMate", href: "#about" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Hành trình", href: "#journey" },
  { label: "Tuyển dụng", href: "#" },
  { label: "Blog", href: "#" },
];

const supportLinks = [
  { label: "Điều khoản & Điều kiện", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Quy trình khiếu nại", href: "#" },
  { label: "Câu hỏi thường gặp", href: "#" },
];

export function PublicFooter() {
  return (
    <footer
      id="footer"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
    >
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Thông tin công ty */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-[var(--color-text)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-lg shadow-sm">
                🧹
              </span>
              CareMate
            </Link>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-6">
              Nền tảng dịch vụ dọn dẹp & chăm sóc gia đình, kết nối khách hàng với
              đội ngũ nhân viên uy tín, tận tâm.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[var(--color-primary)] shrink-0" />
                284/25/20 Lý Thường Kiệt, Q. Tân Bình, TP. Hồ Chí Minh
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                1900 636 736
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                support@caremate.vn
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                Hỗ trợ: 07:00 – 22:00 hằng ngày
              </li>
            </ul>
          </div>

          {/* Công ty */}
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">
              Công ty
            </h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bắt đầu ngay */}
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">
              Bắt đầu ngay
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Đăng ký tài khoản để đặt lịch dọn dẹp chỉ trong vài phút.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/register"
                className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition"
              >
                Đăng ký ngay
              </Link>
              <Link
                href="/login"
                className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-6 text-center text-sm text-[var(--color-text-muted)]">
          © 2016 – 2026 CareMate Co., Ltd. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}
