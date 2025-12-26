import Image from "next/image";
import Link from "next/link";

export default function Header() {
  // 메뉴 항목들
  const menuItems = [
    { label: "매물검색", href: "/search" },
    { label: "부동산소식", href: "/news" },
    { label: "블로그", href: "/blog" },
    { label: "회사소개", href: "/about" },
  ];

  return (
    <header className="flex items-center border-b border-border bg-background py-2">
      <div className="container flex items-center justify-between">
        {/* 왼쪽: 로고 */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_l.png"
            alt="로고"
            width={120}
            height={40}
            className="h-auto"
            priority
          />
        </Link>

        {/* 오른쪽: 메뉴 */}
        <nav className="flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
