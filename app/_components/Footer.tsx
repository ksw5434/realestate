import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Footer 메뉴 항목들
  const footerMenus = [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보 처리방침", href: "/privacy" },
    { label: "회사소개", href: "/about" },
  ];

  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container py-12">
        {/* 상단 섹션: 회사 정보 및 링크 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              부동산 전문
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>힐스테이트 황금엘포레</p>
              <p>상담사: 김수환</p>
              <p className="pt-2">주소: [주소 정보를 입력해주세요]</p>
              <p>전화: [전화번호를 입력해주세요]</p>
              <p>이메일: [이메일을 입력해주세요]</p>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">빠른 링크</h3>
            <nav>
              <ul className="space-y-2">
                {footerMenus.map((menu) => (
                  <li key={menu.href}>
                    <Link
                      href={menu.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {menu.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 서비스 안내 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              서비스 안내
            </h3>
            <nav>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/search"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    매물검색
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    부동산소식
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-primary transition-colors duration-200"
                  >
                    블로그
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* 하단 섹션: 저작권 정보 */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} 부동산 전문. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>사업자등록번호: [사업자등록번호를 입력해주세요]</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
