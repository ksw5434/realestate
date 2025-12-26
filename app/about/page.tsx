import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사 소개",
  description:
    "힐스테이트 황금엘포레 부동산 전문 상담사 김수환입니다. 프리미엄 부동산 매매 및 임대 서비스를 제공하며, 고객 만족을 최우선으로 합니다.",
  openGraph: {
    title: "회사 소개 - 힐스테이트 황금엘포레",
    description:
      "힐스테이트 황금엘포레 부동산 전문 상담사 김수환입니다. 프리미엄 부동산 매매 및 임대 서비스를 제공합니다.",
  },
};

export default function About() {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
