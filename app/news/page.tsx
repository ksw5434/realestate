import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부동산 뉴스",
  description:
    "최신 부동산 시장 뉴스, 정책 변화, 시세 동향 등 부동산 관련 최신 정보를 확인하세요.",
  openGraph: {
    title: "부동산 뉴스 - 힐스테이트 황금엘포레",
    description:
      "최신 부동산 시장 뉴스, 정책 변화, 시세 동향 등 부동산 관련 최신 정보를 제공합니다.",
  },
};

export default function News() {
  return (
    <div>
      <h1>News</h1>
    </div>
  );
}
