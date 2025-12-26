import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈",
  description:
    "힐스테이트 황금엘포레 부동산 전문 사이트에 오신 것을 환영합니다. 프리미엄 부동산 매매 및 임대 서비스를 제공합니다.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black"></div>
  );
}
