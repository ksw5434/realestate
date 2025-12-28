"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdminServer } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

// 공통 타입 정의
export type PropertyFormData = {
  propertyNumber: string;
  title: string;
  subtitle: string;
  price: string;
  area: string;
  rooms: string;
  floor: string;
  direction: string;
  supplyArea: string;
  floorInfo: string;
  roomsBaths: string;
  moveInDate: string;
  entranceStructure: string;
  hasBasicOptions: boolean;
  maintenanceFee: string;
  heatingMethod: string;
  approvalDate: string;
  totalHouseholds: string;
  totalParking: string;
  constructor: string;
  descriptions: string[];
  address: string;
  mapUrl: string;
  facilities: Record<string, string[]>;
  financialInfo: {
    acquisitionTax: string;
    acquisitionTaxNote: string;
    brokerageFeeSale: string;
    brokerageFeeRent: string;
    brokerageFeeNote: string;
    disclaimer: string;
  };
  imageUrls: string[];
};

/**
 * 부동산 매물 생성 서버 액션
 */
export async function createProperty(
  formData: PropertyFormData
): Promise<{ success: boolean; error?: string; propertyId?: string }> {
  try {
    // 관리자 권한 확인 (서버 사이드)
    const adminStatus = await isAdminServer();
    if (!adminStatus) {
      return {
        success: false,
        error: "관리자 권한이 필요합니다.",
      };
    }

    // Supabase 클라이언트 생성
    const supabase = await createClient();

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 프로필에서 created_by 확인 (없으면 자동 생성)
    let { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    // 프로필이 없으면 자동 생성
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || null,
        })
        .select("id")
        .single();

      if (insertError || !newProfile) {
        console.error("프로필 생성 실패:", insertError);
        return {
          success: false,
          error: "프로필을 생성할 수 없습니다.",
        };
      }
      profile = newProfile;
    }

    // 매물 데이터 준비
    const propertyData = {
      property_number: formData.propertyNumber,
      title: formData.title,
      subtitle: formData.subtitle || null,
      price: formData.price,
      area: formData.area || null,
      rooms: formData.rooms || null,
      floor: formData.floor || null,
      direction: formData.direction || null,
      supply_area: formData.supplyArea || null,
      floor_info: formData.floorInfo || null,
      rooms_baths: formData.roomsBaths || null,
      move_in_date: formData.moveInDate || null,
      entrance_structure: formData.entranceStructure || null,
      has_basic_options: formData.hasBasicOptions,
      maintenance_fee: formData.maintenanceFee || null,
      heating_method: formData.heatingMethod || null,
      approval_date: formData.approvalDate || null,
      total_households: formData.totalHouseholds || null,
      total_parking: formData.totalParking || null,
      constructor: formData.constructor || null,
      descriptions: formData.descriptions.length > 0 ? formData.descriptions : null,
      address: formData.address,
      map_url: formData.mapUrl || null,
      facilities: Object.keys(formData.facilities).length > 0 ? formData.facilities : null,
      financial_info: formData.financialInfo,
      created_by: profile.id,
    };

    // 매물 생성
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert(propertyData)
      .select()
      .single();

    if (propertyError) {
      console.error("매물 생성 실패:", propertyError);
      return {
        success: false,
        error: `매물 생성에 실패했습니다: ${propertyError.message}`,
      };
    }

    // 이미지가 있으면 이미지 레코드 생성
    if (formData.imageUrls.length > 0) {
      const imageData = formData.imageUrls
        .filter((url) => url.trim() !== "")
        .map((url, index) => ({
          property_id: property.id,
          image_url: url.trim(),
          image_order: index,
          is_main: index === 0, // 첫 번째 이미지를 메인 이미지로 설정
        }));

      if (imageData.length > 0) {
        const { error: imageError } = await supabase
          .from("property_images")
          .insert(imageData);

        if (imageError) {
          console.error("이미지 생성 실패:", imageError);
          // 이미지 생성 실패해도 매물은 생성된 것으로 처리
        }
      }
    }

    // 캐시 무효화
    revalidatePath("/dashboard/properties");
    revalidatePath("/search");

    return {
      success: true,
      propertyId: property.id,
    };
  } catch (error) {
    console.error("매물 생성 중 오류:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "매물 생성 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 부동산 매물 조회 서버 액션
 */
export async function getProperty(
  id: string
): Promise<{
  success: boolean;
  error?: string;
  property?: any;
}> {
  try {
    const supabase = await createClient();

    // 매물 정보 조회 (작성자 정보 포함)
    // created_by 필드를 통해 매물을 입력한 사람의 profiles 정보를 가져옴
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select(`
        *,
        creator:profiles!created_by (
          id,
          name,
          email,
          phone,
          profile_image,
          company_name,
          company_phone,
          company_email,
          address,
          position
        )
      `)
      .eq("id", id)
      .single();

    if (propertyError || !property) {
      console.error("매물 조회 실패:", propertyError);
      return {
        success: false,
        error: "매물을 찾을 수 없습니다.",
      };
    }

    // 작성자 정보가 없는 경우 로그 출력 (디버깅용)
    if (!property.creator) {
      console.warn(
        `매물 ${id}의 작성자 정보가 없습니다. created_by: ${property.created_by}`
      );
    }

    // 이미지 정보 조회
    const { data: images } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", id)
      .order("image_order", { ascending: true });

    return {
      success: true,
      property: {
        ...property,
        images: images || [],
      },
    };
  } catch (error) {
    console.error("매물 조회 중 오류:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "매물 조회 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 부동산 매물 수정 서버 액션
 */
export async function updateProperty(
  id: string,
  formData: PropertyFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // 관리자 권한 확인 (서버 사이드)
    const adminStatus = await isAdminServer();
    if (!adminStatus) {
      return {
        success: false,
        error: "관리자 권한이 필요합니다.",
      };
    }

    const supabase = await createClient();

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 매물 소유권 확인
    const { data: existingProperty } = await supabase
      .from("properties")
      .select("created_by")
      .eq("id", id)
      .single();

    if (!existingProperty) {
      return {
        success: false,
        error: "매물을 찾을 수 없습니다.",
      };
    }

    // 매물 데이터 준비
    const propertyData = {
      property_number: formData.propertyNumber,
      title: formData.title,
      subtitle: formData.subtitle || null,
      price: formData.price,
      area: formData.area || null,
      rooms: formData.rooms || null,
      floor: formData.floor || null,
      direction: formData.direction || null,
      supply_area: formData.supplyArea || null,
      floor_info: formData.floorInfo || null,
      rooms_baths: formData.roomsBaths || null,
      move_in_date: formData.moveInDate || null,
      entrance_structure: formData.entranceStructure || null,
      has_basic_options: formData.hasBasicOptions,
      maintenance_fee: formData.maintenanceFee || null,
      heating_method: formData.heatingMethod || null,
      approval_date: formData.approvalDate || null,
      total_households: formData.totalHouseholds || null,
      total_parking: formData.totalParking || null,
      constructor: formData.constructor || null,
      descriptions: formData.descriptions.length > 0 ? formData.descriptions : null,
      address: formData.address,
      map_url: formData.mapUrl || null,
      facilities: Object.keys(formData.facilities).length > 0 ? formData.facilities : null,
      financial_info: formData.financialInfo,
    };

    // 매물 업데이트
    const { error: propertyError } = await supabase
      .from("properties")
      .update(propertyData)
      .eq("id", id);

    if (propertyError) {
      console.error("매물 수정 실패:", propertyError);
      return {
        success: false,
        error: `매물 수정에 실패했습니다: ${propertyError.message}`,
      };
    }

    // 기존 이미지 삭제
    await supabase.from("property_images").delete().eq("property_id", id);

    // 새 이미지 추가
    if (formData.imageUrls.length > 0) {
      const imageData = formData.imageUrls
        .filter((url) => url.trim() !== "")
        .map((url, index) => ({
          property_id: id,
          image_url: url.trim(),
          image_order: index,
          is_main: index === 0,
        }));

      if (imageData.length > 0) {
        const { error: imageError } = await supabase
          .from("property_images")
          .insert(imageData);

        if (imageError) {
          console.error("이미지 업데이트 실패:", imageError);
          // 이미지 업데이트 실패해도 매물은 수정된 것으로 처리
        }
      }
    }

    // 캐시 무효화
    revalidatePath("/dashboard/properties");
    revalidatePath(`/dashboard/properties/${id}`);
    revalidatePath("/search");

    return {
      success: true,
    };
  } catch (error) {
    console.error("매물 수정 중 오류:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "매물 수정 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 부동산 매물 삭제 서버 액션
 */
export async function deleteProperty(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 관리자 권한 확인 (서버 사이드)
    const adminStatus = await isAdminServer();
    if (!adminStatus) {
      return {
        success: false,
        error: "관리자 권한이 필요합니다.",
      };
    }

    const supabase = await createClient();

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 매물 삭제 (이미지는 CASCADE로 자동 삭제됨)
    const { error: deleteError } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("매물 삭제 실패:", deleteError);
      return {
        success: false,
        error: `매물 삭제에 실패했습니다: ${deleteError.message}`,
      };
    }

    // 캐시 무효화
    revalidatePath("/dashboard/properties");
    revalidatePath("/search");

    return {
      success: true,
    };
  } catch (error) {
    console.error("매물 삭제 중 오류:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "매물 삭제 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 모든 매물 목록 조회 서버 액션
 */
export async function getAllProperties(): Promise<{
  success: boolean;
  error?: string;
  properties?: any[];
}> {
  try {
    const supabase = await createClient();

    // 매물 목록 조회 (작성자 정보 포함)
    // created_by 필드를 통해 매물을 입력한 사람의 profiles 정보를 가져옴
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select(`
        *,
        creator:profiles!created_by (
          id,
          name,
          email,
          phone,
          profile_image,
          company_name,
          company_phone,
          company_email,
          address,
          position
        )
      `)
      .order("created_at", { ascending: false });

    if (propertiesError) {
      console.error("매물 목록 조회 실패:", propertiesError);
      return {
        success: false,
        error: "매물 목록을 불러오는데 실패했습니다.",
      };
    }

    // 각 매물의 메인 이미지 조회
    const propertiesWithImages = await Promise.all(
      (properties || []).map(async (property) => {
        const { data: mainImage } = await supabase
          .from("property_images")
          .select("image_url")
          .eq("property_id", property.id)
          .eq("is_main", true)
          .single();

        return {
          ...property,
          imageUrl: mainImage?.image_url || null,
        };
      })
    );

    return {
      success: true,
      properties: propertiesWithImages,
    };
  } catch (error) {
    console.error("매물 목록 조회 중 오류:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "매물 목록 조회 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

