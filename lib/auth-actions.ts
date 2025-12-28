"use server";

import { createClient } from "./supabase/server";
import type { ProfileInsert } from "./types/database";

/**
 * 서버 액션: 회원가입 후 프로필 업데이트
 * RLS 정책을 우회하기 위해 서버 사이드에서 실행됩니다.
 */
export async function updateProfileAfterSignup(
  userId: string,
  email: string,
  profileData?: {
    name?: string;
    phone?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return {
        success: false,
        error: "인증되지 않은 사용자입니다.",
      };
    }

    // 프로필 업데이트 데이터 준비
    const profileUpdate: Partial<ProfileInsert> = {
      email: email || null,
      name: profileData?.name || null,
      phone: profileData?.phone || null,
    };

    // 프로필이 생성될 때까지 최대 2초 대기 (최대 10회 시도)
    let profileExists = false;
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 200; // 200ms

    while (!profileExists && retryCount < maxRetries) {
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (existingProfile && !checkError) {
        profileExists = true;
        break;
      }

      if (checkError && checkError.code === "PGRST116") {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryCount++;
      } else {
        console.warn("프로필 확인 중 오류:", checkError);
        break;
      }
    }

    if (!profileExists) {
      return {
        success: false,
        error: "프로필을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    // 프로필 업데이트
    const { error: updateError } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", userId);

    if (updateError) {
      console.error("프로필 업데이트 실패:", updateError);
      return {
        success: false,
        error: "프로필 업데이트에 실패했습니다.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("프로필 업데이트 중 오류:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "프로필 업데이트 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

