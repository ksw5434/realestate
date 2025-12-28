import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Supabase 인증 콜백 처리
 * 이메일 인증, 비밀번호 재설정 등의 리다이렉트를 처리합니다.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 인증 성공 시 지정된 페이지로 리다이렉트
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(
    new URL("/auth/login?error=auth_failed", request.url)
  );
}
