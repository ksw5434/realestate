"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  ArrowLeft,
  Building,
  MapPin,
  Globe,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { getProfile, updateProfile } from "@/lib/profile-client";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

// 이메일 기반 랜덤 아바타 이미지 생성 함수
const generateAvatarFromEmail = (email: string): string => {
  if (!email) return "";
  // UI Avatars 서비스를 사용하여 이메일 기반 랜덤 아바타 생성
  // 이메일을 인코딩하여 URL에 안전하게 사용
  const encodedEmail = encodeURIComponent(email);
  return `https://ui-avatars.com/api/?name=${encodedEmail}&background=random&size=128&bold=true&format=png`;
};

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const authStateListenerRef = useRef<any>(null); // 인증 상태 리스너 참조

  // 사용자 정보 상태 관리
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "", // 프로필 이미지 (없으면 이메일 기반 랜덤 이미지 사용)
  });

  // 회사 정보 상태 관리
  const [companyData, setCompanyData] = useState({
    companyName: "",
    position: "", // 직책 필드 추가
    businessNumber: "",
    representative: "",
    companyPhone: "",
    companyEmail: "",
    address: "",
    website: "",
  });

  // 비밀번호 변경 상태 관리
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI 상태 관리
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false); // 이미지 업로드 중 상태
  const [error, setError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 사용자 정보 로드 함수 (재사용 가능하도록 분리)
  const loadUserData = async () => {
    try {
      // 1. 현재 사용자 정보 가져오기 (이메일)
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // 2. 프로필 정보 가져오기
      const { profile, error: profileError } = await getProfile();

      if (profileError) {
        console.error("프로필 로드 실패:", profileError);
        setError("프로필 정보를 불러오는데 실패했습니다.");
        return;
      }

      if (profile) {
        // 프로필 이미지가 없으면 이메일 기반 랜덤 이미지 생성
        const profileImageUrl = profile.profile_image
          ? profile.profile_image
          : user.email
          ? generateAvatarFromEmail(user.email)
          : "";

        // 프로필 데이터 설정
        setProfileData({
          name: profile.name || "",
          email: user.email || "",
          phone: profile.phone || "",
          profileImage: profileImageUrl,
        });

        // 회사 정보 설정
        setCompanyData({
          companyName: profile.company_name || "",
          position: profile.position || "", // 직책 필드
          businessNumber: profile.business_number || "",
          representative: profile.representative || "",
          companyPhone: profile.company_phone || "",
          companyEmail: profile.company_email || "",
          address: profile.address || "",
          website: profile.website || "",
        });
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 로드 및 인증 상태 감지 설정
  useEffect(() => {
    // 초기 데이터 로드
    loadUserData();

    // URL 쿼리 파라미터 확인 (명시적 refetch 요청)
    const shouldRefetch = searchParams?.get("refetch") === "true";
    if (shouldRefetch) {
      // 쿼리 파라미터 제거 (URL 정리)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("refetch");
      window.history.replaceState({}, "", newUrl.toString());

      // 데이터 다시 로드
      loadUserData();
    }

    // Supabase 인증 상태 변경 감지 (로그인/로그아웃 시 자동 refetch)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // 로그인 이벤트 발생 시 데이터 refetch
      if (event === "SIGNED_IN" && session) {
        console.log("로그인 감지: 프로필 데이터를 다시 불러옵니다.");
        loadUserData();
      }
      // 세션 갱신 시에도 refetch (토큰 갱신 등)
      if (event === "TOKEN_REFRESHED" && session) {
        console.log("세션 갱신: 프로필 데이터를 다시 불러옵니다.");
        loadUserData();
      }
    });

    // 리스너 참조 저장 (정리 시 사용)
    authStateListenerRef.current = subscription;

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      if (authStateListenerRef.current) {
        subscription.unsubscribe();
      }
    };
  }, [router, searchParams]);

  // 프로필 정보 변경 핸들러
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회사 정보 변경 핸들러
  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 프로필 이미지 변경 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 검사 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 이미지 파일 형식 검사
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setIsImageUploading(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();

      // 현재 사용자 정보 가져오기
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("로그인이 필요합니다.");
      }

      // 파일 확장자 추출
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      // 기존 프로필 이미지가 있으면 삭제 (선택사항)
      // 이 부분은 필요에 따라 주석 처리하거나 활성화할 수 있습니다
      // const currentImageUrl = profileData.profileImage;
      // if (currentImageUrl && currentImageUrl.startsWith("http")) {
      //   const oldFileName = currentImageUrl.split("/").pop();
      //   if (oldFileName) {
      //     await supabase.storage
      //       .from("profiles")
      //       .remove([`profile-images/${oldFileName}`]);
      //   }
      // }

      // Supabase Storage에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false, // 동일한 파일명이 있으면 덮어쓰지 않음
        });

      if (uploadError) {
        throw new Error(uploadError.message || "이미지 업로드에 실패했습니다.");
      }

      // 업로드된 파일의 공개 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath);

      // 미리보기용으로 로컬 파일도 표시
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: reader.result as string, // 미리보기용
        }));
      };
      reader.readAsDataURL(file);

      // 프로필 데이터베이스에 이미지 URL 저장
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_image: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        throw new Error(
          updateError.message || "프로필 이미지 업데이트에 실패했습니다."
        );
      }

      // 성공 메시지 표시
      setSuccess("프로필 이미지가 성공적으로 업로드되었습니다.");
      setTimeout(() => setSuccess(""), 3000);

      // 프로필 데이터에 실제 URL 저장 (미리보기 대신)
      setProfileData((prev) => ({
        ...prev,
        profileImage: publicUrl,
      }));
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      setError(
        err instanceof Error
          ? err.message
          : "이미지 업로드에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsImageUploading(false);
      // 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
      e.target.value = "";
    }
  };

  // 프로필 정보 저장 핸들러
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 입력값 유효성 검사
    if (!profileData.name || !profileData.phone) {
      setError("이름과 전화번호를 입력해주세요.");
      return;
    }

    // 전화번호 형식 검사 (선택사항)
    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(profileData.phone)) {
      setError("올바른 전화번호 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // Supabase를 사용한 프로필 업데이트
      const { profile: updatedProfile, error: updateError } =
        await updateProfile({
          name: profileData.name,
          phone: profileData.phone,
          profile_image: profileData.profileImage,
        });

      if (updateError) {
        throw new Error(
          updateError.message || "프로필 업데이트에 실패했습니다."
        );
      }

      if (!updatedProfile) {
        throw new Error("프로필 업데이트에 실패했습니다.");
      }

      setSuccess("프로필이 성공적으로 업데이트되었습니다.");

      // 성공 메시지 3초 후 자동 제거
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "프로필 업데이트에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 회사 정보 저장 핸들러
  const handleCompanySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCompanyError("");
    setSuccess("");

    // 필수 필드 검사 (회사명, 회사 전화번호, 주소만 필수)
    if (
      !companyData.companyName ||
      !companyData.companyPhone ||
      !companyData.address
    ) {
      setCompanyError(
        "필수 항목(회사명, 회사 전화번호, 주소)을 모두 입력해주세요."
      );
      return;
    }

    // 이메일 형식 검사 (입력된 경우에만)
    if (companyData.companyEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyData.companyEmail)) {
        setCompanyError("올바른 이메일 형식을 입력해주세요.");
        return;
      }
    }

    // 사업자등록번호 형식 검사 (입력된 경우에만, 숫자와 하이픈만 허용)
    if (companyData.businessNumber) {
      const businessNumberRegex = /^[0-9-]+$/;
      if (!businessNumberRegex.test(companyData.businessNumber)) {
        setCompanyError("올바른 사업자등록번호 형식을 입력해주세요.");
        return;
      }
    }

    // 웹사이트 URL 형식 검사 (입력된 경우)
    if (companyData.website) {
      try {
        new URL(companyData.website);
      } catch {
        setCompanyError("올바른 웹사이트 URL 형식을 입력해주세요.");
        return;
      }
    }

    setIsCompanyLoading(true);

    try {
      // Supabase를 사용한 회사 정보 업데이트
      const { profile: updatedProfile, error: updateError } =
        await updateProfile({
          company_name: companyData.companyName,
          position: companyData.position || null, // 직책 필드
          business_number: companyData.businessNumber || null,
          representative: companyData.representative || null,
          company_phone: companyData.companyPhone,
          company_email: companyData.companyEmail || null,
          address: companyData.address,
          website: companyData.website || null,
        });

      if (updateError) {
        throw new Error(
          updateError.message || "회사 정보 업데이트에 실패했습니다."
        );
      }

      if (!updatedProfile) {
        throw new Error("회사 정보 업데이트에 실패했습니다.");
      }

      setSuccess("회사 정보가 성공적으로 업데이트되었습니다.");

      // 성공 메시지 3초 후 자동 제거
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setCompanyError(
        err instanceof Error
          ? err.message
          : "회사 정보 업데이트에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsCompanyLoading(false);
    }
  };

  // 비밀번호 변경 핸들러
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    // 입력값 유효성 검사
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("모든 필드를 입력해주세요.");
      return;
    }

    // 새 비밀번호 길이 검사
    if (passwordData.newPassword.length < 8) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    // 새 비밀번호 확인 검사
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 현재 비밀번호와 새 비밀번호가 같은지 검사
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    setIsPasswordLoading(true);

    try {
      const supabase = createClient();

      // 현재 비밀번호 확인 (재로그인으로 확인)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: passwordData.currentPassword,
      });

      if (signInError) {
        throw new Error("현재 비밀번호가 올바르지 않습니다.");
      }

      // 비밀번호 변경
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) {
        throw new Error(updateError.message || "비밀번호 변경에 실패했습니다.");
      }

      setPasswordError("");
      setSuccess("비밀번호가 성공적으로 변경되었습니다.");

      // 폼 초기화
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // 성공 메시지 3초 후 자동 제거
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : "비밀번호 변경에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="container py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">돌아가기</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">프로필 수정</h1>
        <p className="text-sm text-muted-foreground mt-2">
          프로필 정보와 비밀번호를 수정할 수 있습니다.
        </p>
      </div>

      {/* 성공 메시지 */}
      {success && (
        <div className="mb-6 p-4 rounded-md bg-primary/10 border border-primary/20">
          <p className="text-sm text-primary text-center">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 컬럼: 프로필 이미지 및 기본 정보 */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg bg-card p-6 sticky top-4">
            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted mb-4">
                {isImageUploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : profileData.profileImage ? (
                  <Image
                    src={profileData.profileImage}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                    unoptimized={profileData.profileImage.startsWith("data:")} // base64 이미지는 최적화 비활성화
                  />
                ) : profileData.email ? (
                  // 프로필 이미지가 없을 때 이메일 기반 랜덤 이미지 표시
                  <Image
                    src={generateAvatarFromEmail(profileData.email)}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                  />
                ) : (
                  // 이메일도 없을 때 기본 아이콘 표시
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-image"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors cursor-pointer text-sm ${
                  isImageUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Camera className="w-4 h-4" />
                {isImageUploading ? "업로드 중..." : "이미지 변경"}
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isImageUploading}
                className="hidden"
              />
            </div>

            {/* 기본 정보 요약 */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{profileData.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="break-all">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{profileData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼: 프로필 수정 폼 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 프로필 정보 수정 섹션 */}
          <div className="border border-border rounded-lg bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              프로필 정보
            </h2>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* 이름 입력 */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  이름
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={profileData.name ?? ""}
                    onChange={handleProfileChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="이름을 입력하세요"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 이메일 입력 (읽기 전용) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={profileData.email ?? ""}
                    readOnly
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-muted text-foreground cursor-not-allowed"
                    placeholder="이메일을 입력하세요"
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  이메일은 로그인 계정과 연동되어 있어 변경할 수 없습니다.
                </p>
              </div>

              {/* 전화번호 입력 */}
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
                    required
                    value={profileData.phone ?? ""}
                    onChange={handleProfileChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground py-2 px-6 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          </div>

          {/* 회사 정보 섹션 */}
          <div className="border border-border rounded-lg bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              회사 정보
            </h2>

            {/* 에러 메시지 */}
            {companyError && (
              <div className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{companyError}</p>
              </div>
            )}

            <form onSubmit={handleCompanySubmit} className="space-y-6">
              {/* 회사명 입력 */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  회사명 <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={companyData.companyName ?? ""}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="회사명을 입력하세요"
                    disabled={isCompanyLoading}
                  />
                </div>
              </div>

              {/* 직책 입력 */}
              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  직책
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={companyData.position ?? ""}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="직책을 입력하세요 (예: 대표이사, 팀장 등)"
                    disabled={isCompanyLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  선택사항입니다.
                </p>
              </div>

              {/* 사업자등록번호 입력 */}
              <div>
                <label
                  htmlFor="businessNumber"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  사업자등록번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="businessNumber"
                    name="businessNumber"
                    type="text"
                    value={companyData.businessNumber ?? ""}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="사업자등록번호를 입력하세요 (예: 123-45-67890)"
                    disabled={isCompanyLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  선택사항입니다.
                </p>
              </div>

              {/* 대표자명 입력 */}
              <div>
                <label
                  htmlFor="representative"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  대표자명
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="representative"
                    name="representative"
                    type="text"
                    value={companyData.representative ?? ""}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="대표자명을 입력하세요"
                    disabled={isCompanyLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  선택사항입니다.
                </p>
              </div>

              {/* 회사 전화번호 입력 */}
              <div>
                <label
                  htmlFor="companyPhone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  회사 전화번호 <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="companyPhone"
                    name="companyPhone"
                    type="tel"
                    required
                    value={companyData.companyPhone ?? ""}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="회사 전화번호를 입력하세요 (예: 02-1234-5678)"
                    disabled={isCompanyLoading}
                  />
                </div>
              </div>

              {/* 회사 이메일 입력 */}
              <div>
                <label
                  htmlFor="companyEmail"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  회사 이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={companyData.companyEmail ?? ""}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="회사 이메일을 입력하세요"
                    disabled={isCompanyLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  선택사항입니다.
                </p>
              </div>

              {/* 주소 입력 */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  주소 <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={companyData.address ?? ""}
                    onChange={handleCompanyChange}
                    rows={2}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="회사 주소를 입력하세요"
                    disabled={isCompanyLoading}
                  />
                </div>
              </div>

              {/* 웹사이트 입력 (선택사항) */}
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  웹사이트
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={companyData.website ?? ""}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="웹사이트 URL을 입력하세요 (예: https://example.com)"
                    disabled={isCompanyLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  선택사항입니다. https:// 또는 http://를 포함하여 입력해주세요.
                </p>
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCompanyLoading}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground py-2 px-6 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isCompanyLoading ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          </div>

          {/* 비밀번호 변경 섹션 */}
          <div className="border border-border rounded-lg bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              비밀번호 변경
            </h2>

            {/* 에러 메시지 */}
            {passwordError && (
              <div className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* 현재 비밀번호 입력 */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  현재 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="현재 비밀번호를 입력하세요"
                    disabled={isPasswordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showCurrentPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 입력 */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  새 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="새 비밀번호를 입력하세요 (최소 8자)"
                    disabled={isPasswordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 확인 입력 */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    disabled={isPasswordLoading}
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

              {/* 변경 버튼 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground py-2 px-6 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  {isPasswordLoading ? "변경 중..." : "비밀번호 변경"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
