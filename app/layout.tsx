import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "부동산 전문 - 힐스테이트 황금엘포레",
    template: "%s | 부동산 전문",
  },
  description:
    "힐스테이트 황금엘포레 부동산 전문. 프리미엄 부동산 매매 및 임대 서비스. 전문 상담사가 최고의 부동산 솔루션을 제공합니다.",
  keywords: [
    "부동산",
    "매매",
    "임대",
    "힐스테이트",
    "황금엘포레",
    "부동산 중개",
    "부동산 상담",
  ],
  authors: [{ name: "김수환" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "부동산 전문",
    title: "부동산 전문 - 힐스테이트 황금엘포레",
    description:
      "힐스테이트 황금엘포레 부동산 전문. 프리미엄 부동산 매매 및 임대 서비스.",
  },
  twitter: {
    card: "summary_large_image",
    title: "부동산 전문 - 힐스테이트 황금엘포레",
    description:
      "힐스테이트 황금엘포레 부동산 전문. 프리미엄 부동산 매매 및 임대 서비스.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
