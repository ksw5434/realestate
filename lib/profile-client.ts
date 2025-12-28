import { createClient } from "./supabase/client";
import type { Profile, ProfileInsert } from "./types/database";

/**
 * 클라이언트 컴포넌트에서 사용할 프로필 관련 함수들
 */

/**
 * 현재 사용자의 프로필 정보 가져오기
 */
export async function getProfile(): Promise<{
  profile: Profile | null;
  error: Error | null;
}> {
  try {
    const supabase = createClient();

    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        profile: null,
        error: new Error("로그인이 필요합니다."),
      };
    }

    // 프로필 정보 조회
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // 프로필이 없는 경우 (PGRST116은 "no rows returned" 에러)
      if (profileError.code === "PGRST116") {
        // 프로필 생성 시도
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email || null,
        });

        if (insertError) {
          return {
            profile: null,
            error: new Error("프로필을 생성할 수 없습니다."),
          };
        }

        // 생성 후 다시 조회
        const { data: newProfile, error: newProfileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (newProfileError) {
          return {
            profile: null,
            error: new Error("프로필을 불러올 수 없습니다."),
          };
        }

        return { profile: newProfile, error: null };
      }

      return {
        profile: null,
        error: new Error(
          profileError.message || "프로필을 불러올 수 없습니다."
        ),
      };
    }

    return { profile, error: null };
  } catch (err) {
    return {
      profile: null,
      error:
        err instanceof Error
          ? err
          : new Error("프로필 조회 중 오류가 발생했습니다."),
    };
  }
}

/**
 * 프로필 정보 업데이트
 * 업데이트된 프로필 정보를 반환합니다.
 */
export async function updateProfile(
  updates: Partial<ProfileInsert>
): Promise<{ profile: Profile | null; error: Error | null }> {
  try {
    const supabase = createClient();

    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { profile: null, error: new Error("로그인이 필요합니다.") };
    }

    // 프로필 업데이트
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (updateError) {
      return {
        profile: null,
        error: new Error(
          updateError.message || "프로필 업데이트에 실패했습니다."
        ),
      };
    }

    // 업데이트된 프로필 정보 조회
    const { data: updatedProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      return {
        profile: null,
        error: new Error(
          fetchError.message || "업데이트된 프로필을 불러올 수 없습니다."
        ),
      };
    }

    return { profile: updatedProfile, error: null };
  } catch (err) {
    return {
      profile: null,
      error:
        err instanceof Error
          ? err
          : new Error("프로필 업데이트 중 오류가 발생했습니다."),
    };
  }
}
