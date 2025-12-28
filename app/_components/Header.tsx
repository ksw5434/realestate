"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getCurrentUser, isAdmin, signOut } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  // 관리자 권한 상태 관리
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  // 드롭다운 메뉴 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 메뉴 항목들
  const menuItems = [
    { label: "매물검색", href: "/search" },
    { label: "부동산소식", href: "/news" },
    { label: "블로그", href: "/blog" },
    { label: "회사소개", href: "/about" },
  ];

  // 사용자 로그인 및 관리자 권한 확인
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // 로그인 상태 확인
        const user = await getCurrentUser();

        if (!user) {
          // 로그인하지 않은 경우
          setIsUserAdmin(false);
          setIsChecking(false);
          return;
        }

        // 관리자 권한 확인
        const adminStatus = await isAdmin();
        setIsUserAdmin(adminStatus);
      } catch (error) {
        console.error("관리자 권한 확인 중 오류:", error);
        setIsUserAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error("로그아웃 중 오류:", error);
        return;
      }
      // 로그아웃 성공 시 홈으로 이동
      setIsDropdownOpen(false);
      setIsUserAdmin(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 중 예외 발생:", error);
    }
  };

  return (
    <header className="flex items-center border-b border-border bg-background py-4">
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
          {/* 관리자일 때만 대시보드 드롭다운 메뉴 표시 (회사소개 옆) */}
          {!isChecking && isUserAdmin && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-md text-foreground hover:text-primary hover:border-primary transition-colors duration-200 font-medium"
              >
                관리자 대시보드
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      프로필
                    </Link>
                    <Link
                      href="/dashboard/properties"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      매물관리
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
