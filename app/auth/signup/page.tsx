"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone, Check } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // 약관 동의 상태 관리
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false, // 선택사항
  });

  // UI 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 폼 데이터 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 약관 동의 변경 핸들러
  const handleAgreementChange = (name: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // 회원가입 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 필수 필드 검사
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 이름 길이 검사
    if (formData.name.length < 2) {
      setError("이름은 최소 2자 이상이어야 합니다.");
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 비밀번호 길이 검사
    if (formData.password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 전화번호 형식 검사 (입력된 경우)
    if (formData.phone) {
      const phoneRegex = /^[0-9-]+$/;
      if (!phoneRegex.test(formData.phone)) {
        setError("올바른 전화번호 형식을 입력해주세요.");
        return;
      }
    }

    // 필수 약관 동의 검사
    if (!agreements.terms || !agreements.privacy) {
      setError("필수 약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 실제 API 호출로 대체 필요
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     password: formData.password,
      //     phone: formData.phone || undefined,
      //     marketingAgreement: agreements.marketing,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || '회원가입에 실패했습니다.');
      // }
      //
      // const data = await response.json();
      // localStorage.setItem('token', data.token);
      // router.push('/dashboard/profile');

      // 임시: 성공 시뮬레이션 (실제 구현 시 제거)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("회원가입 시도:", {
        ...formData,
        marketingAgreement: agreements.marketing,
      });

      // 회원가입 성공 시 프로필 페이지로 이동
      router.push("/dashboard/profile");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "회원가입에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex  justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* 회원가입 카드 */}
        <div className="border border-border rounded-lg bg-card p-8 shadow-lg">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              회원가입
            </h1>
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                로그인
              </Link>
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 입력 */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                이름 <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                이메일 <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="이메일을 입력하세요"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 전화번호 입력 (선택사항) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground mb-2"
              >
                전화번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="전화번호를 입력하세요 (선택사항)"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                비밀번호 <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="비밀번호를 입력하세요 (최소 8자)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                최소 8자 이상 입력해주세요.
              </p>
            </div>

            {/* 비밀번호 확인 입력 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                비밀번호 확인 <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 pt-2">
              {/* 이용약관 동의 */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={() => handleAgreementChange("terms")}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      agreements.terms
                        ? "bg-primary border-primary"
                        : "border-input"
                    }`}
                  >
                    {agreements.terms && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-foreground flex-1">
                  <span className="text-destructive">*</span>{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    이용약관
                  </Link>
                  에 동의합니다.
                </span>
              </label>

              {/* 개인정보 처리방침 동의 */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() => handleAgreementChange("privacy")}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      agreements.privacy
                        ? "bg-primary border-primary"
                        : "border-input"
                    }`}
                  >
                    {agreements.privacy && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-foreground flex-1">
                  <span className="text-destructive">*</span>{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    개인정보 처리방침
                  </Link>
                  에 동의합니다.
                </span>
              </label>

              {/* 마케팅 정보 수신 동의 (선택사항) */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={() => handleAgreementChange("marketing")}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      agreements.marketing
                        ? "bg-primary border-primary"
                        : "border-input"
                    }`}
                  >
                    {agreements.marketing && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-foreground flex-1">
                  마케팅 정보 수신에 동의합니다. (선택사항)
                </span>
              </label>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
