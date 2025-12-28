/**
 * 서버 사이드 인증 관련 유틸리티 함수들
 * 서버 액션이나 서버 컴포넌트에서만 사용합니다.
 */

import { createClient } from "./supabase/server";

/**
 * 서버 사이드에서 사용할 관리자 권한 확인 함수
 * 서버 액션이나 서버 컴포넌트에서 사용합니다.
 */
export async function isAdminServer(): Promise<boolean> {
  try {
    const supabase = await createClient();

    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return false;
    }

    // 프로필에서 is_admin 확인
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return false;
    }

    return profile.is_admin === true;
  } catch (error) {
    console.error("서버 사이드 관리자 권한 확인 중 오류:", error);
    return false;
  }
}

