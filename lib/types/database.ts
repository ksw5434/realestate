/**
 * Supabase 데이터베이스 타입 정의
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          // 기본 필드
          id: string; // uuid, auth.users 참조
          created_at: string; // timestamp
          updated_at: string; // timestamp

          // 프로필 정보 (선택사항)
          name: string | null;
          email: string | null;
          phone: string | null;
          profile_image: string | null;
          is_admin: boolean; // 관리자 여부

          // 회사 정보 (선택사항)
          company_name: string | null;
          position: string | null; // 직책
          business_number: string | null;
          representative: string | null;
          company_phone: string | null;
          company_email: string | null;
          address: string | null;
          website: string | null;
        };
        Insert: {
          // id는 auth.users에서 자동 생성되므로 선택사항
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          profile_image?: string | null;
          is_admin?: boolean;
          company_name?: string | null;
          position?: string | null; // 직책
          business_number?: string | null;
          representative?: string | null;
          company_phone?: string | null;
          company_email?: string | null;
          address?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          profile_image?: string | null;
          is_admin?: boolean;
          company_name?: string | null;
          position?: string | null; // 직책
          business_number?: string | null;
          representative?: string | null;
          company_phone?: string | null;
          company_email?: string | null;
          address?: string | null;
          website?: string | null;
        };
      };
    };
  };
}

/**
 * Profile 타입 (편의를 위한 별칭)
 */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Profile Insert 타입
 */
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

/**
 * Profile Update 타입
 */
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
