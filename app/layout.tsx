import type { Metadata } from "next";
import { Providers } from "@/providers";
// @ts-ignore: CSS side-effect import type declarations may be missing in this environment
import "./globals.css";

export const metadata: Metadata = {
  title: "CareMate — Dịch vụ dọn dẹp nhà",
  description: "Nền tảng đặt dịch vụ dọn dẹp nhà chuyên nghiệp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
