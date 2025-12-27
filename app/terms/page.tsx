import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description:
    "힐스테이트 황금엘포레 이용약관입니다. 서비스 이용에 관한 규정 및 조건을 확인하실 수 있습니다.",
  openGraph: {
    title: "이용약관 - 부동산 전문",
    description:
      "힐스테이트 황금엘포레 이용약관입니다. 서비스 이용에 관한 규정 및 조건을 확인하실 수 있습니다.",
  },
};

export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">이용약관</h1>
        <div className="text-sm text-muted-foreground mb-8">
          최종 수정일: 2026년 1월 1일
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* 제1조 목적 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
            <p className="text-foreground leading-relaxed">
              본 약관은 힐스테이트 황금엘포레(이하 "서비스")의 이용과 관련하여
              서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을
              목적으로 합니다.
            </p>
          </section>

          {/* 제2조 정의 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">제2조 (정의)</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>
                "서비스"란 부동산 매매, 임대, 상담 등 부동산 관련 정보 및
                서비스를 제공하는 플랫폼을 의미합니다.
              </li>
              <li>
                "이용자"란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
              </li>
              <li>
                "회원"이란 서비스에 회원등록을 하고 서비스를 이용하는 자를
                의미합니다.
              </li>
            </ul>
          </section>

          {/* 제3조 약관의 효력 및 변경 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제3조 (약관의 효력 및 변경)
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게
                공지함으로써 효력을 발생합니다.
              </li>
              <li>
                서비스 제공자는 필요한 경우 관련 법령을 위배하지 않는 범위에서
                본 약관을 변경할 수 있습니다.
              </li>
              <li>
                약관이 변경되는 경우 변경사항의 시행일자 및 변경내용을 명시하여
                현행약관과 함께 서비스의 초기화면에 그 시행일자 7일 이전부터
                시행일자 전일까지 공지합니다.
              </li>
            </ol>
          </section>

          {/* 제4조 서비스의 제공 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제4조 (서비스의 제공)
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                서비스 제공자는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>부동산 매매 정보 제공</li>
                  <li>부동산 임대 정보 제공</li>
                  <li>부동산 상담 서비스</li>
                  <li>기타 부동산 관련 정보 및 서비스</li>
                </ul>
              </li>
              <li>
                서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만,
                서비스 제공자의 업무상이나 기술상의 이유로 서비스가 일시 중단될
                수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제5조 이용자의 의무 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제5조 (이용자의 의무)
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                이용자는 다음 행위를 하여서는 안 됩니다:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>타인의 정보 도용</li>
                  <li>허위 정보의 등록</li>
                  <li>서비스의 안정적 운영을 방해하는 행위</li>
                  <li>관련 법령에 위반되는 행위</li>
                  <li>기타 서비스 제공자가 부적절하다고 판단하는 행위</li>
                </ul>
              </li>
              <li>
                이용자가 위의 의무를 위반한 경우 서비스 제공자는 이용 제한, 계약
                해지 등의 조치를 취할 수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제6조 개인정보 보호 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제6조 (개인정보 보호)
            </h2>
            <p className="text-foreground leading-relaxed">
              서비스 제공자는 이용자의 개인정보 보호를 위하여 노력합니다.
              이용자의 개인정보 보호에 관해서는 관련 법령 및 서비스 제공자가
              정하는 "개인정보 처리방침"에 따릅니다.
            </p>
          </section>

          {/* 제7조 면책사항 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">제7조 (면책사항)</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                서비스 제공자는 천재지변 또는 이에 준하는 불가항력으로 인하여
                서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
                면제됩니다.
              </li>
              <li>
                서비스 제공자는 이용자의 귀책사유로 인한 서비스 이용의 장애에
                대하여는 책임을 지지 않습니다.
              </li>
              <li>
                서비스 제공자는 이용자가 서비스를 이용하여 기대하는 수익을
                상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여
                얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          {/* 제8조 분쟁의 해결 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">제8조 (분쟁의 해결)</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                서비스 제공자와 이용자 간에 발생한 분쟁에 관한 소송은 제소당시의
                이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는
                지방법원의 전속관할로 합니다.
              </li>
              <li>
                서비스 제공자와 이용자 간에 발생한 분쟁에 관한 소송에는 대한민국
                법을 적용합니다.
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
