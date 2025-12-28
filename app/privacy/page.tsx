import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description:
    "힐스테이트 황금엘포레 개인정보 처리방침입니다. 개인정보의 수집, 이용, 보관 및 파기 등에 관한 사항을 확인하실 수 있습니다.",
  openGraph: {
    title: "개인정보 처리방침 - 부동산 전문",
    description:
      "힐스테이트 황금엘포레 개인정보 처리방침입니다. 개인정보의 수집, 이용, 보관 및 파기 등에 관한 사항을 확인하실 수 있습니다.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">개인정보 처리방침</h1>
        <div className="text-sm text-muted-foreground mb-8">
          최종 수정일: 2026년 1월 1일
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* 제1조 총칙 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">제1조 (총칙)</h2>
            <p className="text-foreground leading-relaxed">
              힐스테이트 황금엘포레(이하 "서비스")는 이용자의 개인정보 보호를 매우
              중요하게 생각하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및
              정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다. 본
              개인정보 처리방침은 서비스가 이용자의 개인정보를 어떻게 수집,
              이용, 보관, 파기하는지에 대한 내용을 담고 있습니다.
            </p>
          </section>

          {/* 제2조 수집하는 개인정보의 항목 및 수집 방법 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제2조 (수집하는 개인정보의 항목 및 수집 방법)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  1. 수집하는 개인정보 항목
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>
                    <strong>필수 항목:</strong> 이름, 연락처(전화번호, 이메일),
                    부동산 관련 문의 내용
                  </li>
                  <li>
                    <strong>선택 항목:</strong> 주소, 상세 요구사항
                  </li>
                  <li>
                    <strong>자동 수집 항목:</strong> IP 주소, 쿠키, 접속 로그,
                    기기 정보, 브라우저 정보
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. 수집 방법</h3>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>서비스 이용 시 직접 입력</li>
                  <li>상담 신청 시 입력</li>
                  <li>이메일, 전화 등을 통한 상담</li>
                  <li>서비스 이용 과정에서 자동 수집</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 제3조 개인정보의 수집 및 이용 목적 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제3조 (개인정보의 수집 및 이용 목적)
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              서비스는 다음의 목적을 위하여 개인정보를 처리합니다:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                <strong>서비스 제공:</strong> 부동산 매매, 임대 정보 제공 및
                상담 서비스 제공
              </li>
              <li>
                <strong>회원 관리:</strong> 회원 식별, 본인 확인, 부정 이용 방지
              </li>
              <li>
                <strong>고객 지원:</strong> 문의사항 응대, 불만 처리, 공지사항
                전달
              </li>
              <li>
                <strong>서비스 개선:</strong> 서비스 품질 향상, 신규 서비스 개발
              </li>
            </ol>
          </section>

          {/* 제4조 개인정보의 보유 및 이용 기간 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제4조 (개인정보의 보유 및 이용 기간)
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                서비스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                개인정보를 처리·보유합니다.
              </li>
              <li>
                각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    <strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 관련 법령에
                    따라 보존이 필요한 경우 해당 기간 동안 보관)
                  </li>
                  <li>
                    <strong>상담 문의:</strong> 상담 완료 후 3년
                  </li>
                  <li>
                    <strong>계약 관련 정보:</strong> 계약 완료 후 5년 (부동산
                    거래 관련 법령에 따라)
                  </li>
                </ul>
              </li>
            </ol>
          </section>

          {/* 제5조 개인정보의 제3자 제공 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제5조 (개인정보의 제3자 제공)
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ol>
          </section>

          {/* 제6조 개인정보 처리의 위탁 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제6조 (개인정보 처리의 위탁)
            </h2>
            <p className="text-foreground leading-relaxed">
              서비스는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
              처리업무를 위탁하고 있습니다:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-foreground">
                현재 개인정보 처리 위탁 업체는 없습니다. 향후 위탁이 필요한
                경우, 사전에 공지하고 이용자의 동의를 받겠습니다.
              </p>
            </div>
          </section>

          {/* 제7조 정보주체의 권리·의무 및 행사방법 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제7조 (정보주체의 권리·의무 및 행사방법)
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground">
              <li>
                이용자는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할
                수 있습니다:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>개인정보 처리정지 요구권</li>
                  <li>개인정보 열람 요구권</li>
                  <li>개인정보 정정·삭제 요구권</li>
                  <li>개인정보 처리정지 요구권</li>
                </ul>
              </li>
              <li>
                제1항에 따른 권리 행사는 서비스에 대해 서면, 전자우편, 모사전송
                등을 통하여 하실 수 있으며, 서비스는 이에 대해 지체 없이
                조치하겠습니다.
              </li>
            </ol>
          </section>

          {/* 제8조 개인정보의 파기 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제8조 (개인정보의 파기)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. 파기 절차</h3>
                <p className="text-foreground leading-relaxed">
                  이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의
                  경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간
                  저장된 후 혹은 즉시 파기됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. 파기 방법</h3>
                <ul className="list-disc pl-6 space-y-2 text-foreground">
                  <li>
                    <strong>전자적 파일 형태:</strong> 기록을 재생할 수 없는
                    기술적 방법을 사용하여 삭제
                  </li>
                  <li>
                    <strong>기록물, 인쇄물, 서면 등:</strong> 분쇄하거나 소각하여
                    파기
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 제9조 개인정보 보호책임자 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제9조 (개인정보 보호책임자)
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다:
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-2">
              <p className="text-foreground">
                <strong>개인정보 보호책임자</strong>
              </p>
              <p className="text-foreground">성명: 김수환</p>
              <p className="text-foreground">연락처: [연락처 정보]</p>
              <p className="text-foreground">이메일: [이메일 주소]</p>
            </div>
          </section>

          {/* 제10조 개인정보 처리방침 변경 */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              제10조 (개인정보 처리방침 변경)
            </h2>
            <p className="text-foreground leading-relaxed">
              이 개인정보 처리방침은 2026년 1월 1일부터 적용되며, 법령 및
              방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의
              시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}



