import { createClient } from "./supabase/client";
import type { User } from "@supabase/supabase-js";
import type { ProfileInsert } from "./types/database";
import { getProfile } from "./profile-client";

/**
 * 인증 관련 유틸리티 함수들
 */

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * 로그인 상태 확인
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * 현재 사용자가 관리자인지 확인 (클라이언트 사이드)
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { profile, error } = await getProfile();

    if (error || !profile) {
      return false;
    }

    return profile.is_admin === true;
  } catch (error) {
    console.error("관리자 권한 확인 중 오류:", error);
    return false;
  }
}

/**
 * 이메일/비밀번호로 로그인
 * 로그인 성공 시 프로필이 없으면 자동으로 생성합니다.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: Error | null }> {
  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      const missingVars = [];
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!supabaseAnonKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

      const errorMsg = `환경 변수가 설정되지 않았습니다: ${missingVars.join(
        ", "
      )}. .env.local 파일을 확인해주세요.`;
      return { user: null, error: new Error(errorMsg) };
    }

    // Supabase 클라이언트 생성
    const supabase = createClient();

    // 로그인 요청 실행
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Supabase 에러 메시지를 한국어로 변환
      let errorMessage = "로그인에 실패했습니다.";

      const errorMsg = error?.message || String(error);
      const errorStatus = (error as any)?.status;
      const errorCode = (error as any)?.code;

      // Supabase 에러 코드별 처리
      if (
        errorMsg.includes("Email not confirmed") ||
        errorMsg.includes("email_not_confirmed") ||
        errorCode === "email_not_confirmed"
      ) {
        errorMessage =
          "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.";
      } else if (
        errorMsg.includes("Invalid login credentials") ||
        errorMsg.includes("invalid_credentials") ||
        errorCode === "invalid_credentials" ||
        errorStatus === 400
      ) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (
        errorMsg.includes("User not found") ||
        errorCode === "user_not_found"
      ) {
        errorMessage = "등록되지 않은 이메일입니다.";
      } else if (
        errorMsg.includes("Too many requests") ||
        errorStatus === 429
      ) {
        errorMessage =
          "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      } else if (
        errorMsg.includes("timeout") ||
        errorMsg.includes("network") ||
        errorMsg.includes("fetch") ||
        errorMsg.includes("Failed to fetch")
      ) {
        errorMessage =
          "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.";
      } else if (errorMsg.includes("환경 변수")) {
        errorMessage = errorMsg;
      } else {
        errorMessage = errorMsg || "로그인에 실패했습니다. 다시 시도해주세요.";
      }

      const customError = new Error(errorMessage);
      Object.assign(customError, {
        originalError: error,
        originalMessage: errorMsg,
        status: (error as any)?.status,
        name: (error as any)?.name,
      });

      return { user: null, error: customError };
    }

    if (!data || !data.user) {
      return { user: null, error: new Error("로그인에 실패했습니다.") };
    }

    // 프로필이 없으면 생성 (백그라운드에서 처리)
    (async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        // 프로필이 없으면 생성
        if (profileError && profileError.code === "PGRST116") {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
            });

          if (insertError) {
            console.error("프로필 생성 실패:", insertError);
          } else {
            console.log("프로필 자동 생성 완료");
          }
        }
      } catch (profileErr) {
        console.error("프로필 확인 중 오류:", profileErr);
      }
    })();

    return { user: data.user, error: null };
  } catch (err) {
    console.error("로그인 함수 실행 중 예외:", err);
    return {
      user: null,
      error:
        err instanceof Error
          ? err
          : new Error("로그인 중 알 수 없는 오류가 발생했습니다."),
    };
  }
}

/**
 * 이메일/비밀번호로 회원가입
 * 회원가입 성공 시 profiles 테이블에 프로필 정보도 함께 저장합니다.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  profileData?: {
    name?: string;
    phone?: string;
    [key: string]: any;
  }
): Promise<{ user: User | null; error: Error | null }> {
  try {
    const supabase = createClient();

    // 1. Supabase Auth에 사용자 생성
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData, // 메타데이터로 저장 (선택사항)
      },
    });

    if (error) {
      // 에러 메시지를 한국어로 변환
      let errorMessage = "회원가입에 실패했습니다.";

      const errorMsg = error?.message || String(error);
      if (errorMsg.includes("User already registered")) {
        errorMessage = "이미 등록된 이메일입니다.";
      } else if (errorMsg.includes("Password")) {
        errorMessage =
          "비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.";
      } else if (errorMsg.includes("Email")) {
        errorMessage = "올바른 이메일 형식이 아닙니다.";
      } else {
        errorMessage = errorMsg;
      }

      return { user: null, error: new Error(errorMessage) };
    }

    if (!data.user) {
      return { user: null, error: new Error("사용자 생성에 실패했습니다.") };
    }

    // 2. profiles 테이블에 프로필 정보 저장
    // 트리거가 자동으로 프로필을 생성하므로, 프로필 업데이트는 서버 액션으로 처리합니다.
    // 클라이언트 사이드에서 RLS 정책 때문에 프로필 생성/업데이트가 실패할 수 있으므로,
    // 프로필 업데이트는 백그라운드에서 처리하거나 이메일 인증 후에 처리합니다.
    // 여기서는 프로필 처리를 생략하고, 트리거가 생성한 기본 프로필을 사용합니다.
    // 필요시 이메일 인증 후 프로필을 업데이트할 수 있습니다.

    return { user: data.user, error: null };
  } catch (err) {
    console.error("회원가입 함수 실행 중 예외:", err);
    return {
      user: null,
      error:
        err instanceof Error
          ? err
          : new Error("회원가입 중 알 수 없는 오류가 발생했습니다."),
    };
  }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error as Error };
    }

    return { error: null };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err
          : new Error("로그아웃 중 오류가 발생했습니다."),
    };
  }
}

/**
 * 비밀번호 재설정 이메일 전송
 */
export async function resetPassword(
  email: string,
  redirectTo?: string
): Promise<{ error: Error | null }> {
  try {
    const supabase = createClient();

    const redirectUrl =
      redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : "/auth/reset-password");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      return { error: error as Error };
    }

    return { error: null };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err
          : new Error("비밀번호 재설정 중 오류가 발생했습니다."),
    };
  }
}

/**
 * 현재 사용자와 프로필 정보를 함께 가져오기
 */
export async function getCurrentUserWithProfile(): Promise<{
  user: User | null;
  profile: any | null;
  error: Error | null;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      error: new Error("로그인이 필요합니다."),
    };
  }

  const { profile, error } = await getProfile();

  if (error) {
    return { user, profile: null, error };
  }

  return { user, profile, error: null };
}
