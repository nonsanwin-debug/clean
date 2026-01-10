import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "새로고침 - 프리미엄 청소 중개 플랫폼",
  description: "입주청소, 이사청소, 거주청소 전문 플랫폼. 검증된 전문가에게 견적을 받아보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary tracking-tight">
                새로고침
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/request" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
                견적 요청
              </Link>
              <Link href="/partner/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block">
                파트너 로그인
              </Link>
              <Button size="sm">견적 무료로 받기</Button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 md:px-8">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2026 새로고침. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-sm text-muted-foreground">Terms</span>
              <span className="text-sm text-muted-foreground">Privacy</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
