import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부동산 검색",
  description:
    "프리미엄 부동산 매물을 검색하고 상세 정보를 확인하세요. 힐스테이트 황금엘포레 전문 상담사가 최고의 부동산 솔루션을 제공합니다.",
  openGraph: {
    title: "부동산 검색 - 힐스테이트 황금엘포레",
    description:
      "프리미엄 부동산 매물을 검색하고 상세 정보를 확인하세요. 전문 상담사가 최고의 부동산 솔루션을 제공합니다.",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


