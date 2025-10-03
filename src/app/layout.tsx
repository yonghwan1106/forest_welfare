import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "산림복지 시민정원사",
  description: "AI 기반 산림복지 활동 매칭 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
