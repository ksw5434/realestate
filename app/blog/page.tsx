import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그",
  description:
    "부동산 시장 동향, 투자 정보, 매매 팁 등 유용한 부동산 정보를 제공하는 블로그입니다.",
  openGraph: {
    title: "부동산 블로그 - 힐스테이트 황금엘포레",
    description:
      "부동산 시장 동향, 투자 정보, 매매 팁 등 유용한 부동산 정보를 제공합니다.",
  },
};

export default function Blog() {
  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}
