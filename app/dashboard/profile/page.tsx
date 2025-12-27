"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export default function ProfilePage() {
  const router = useRouter();

  // 사용자 정보 상태 관리
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "/search/profile.jpg", // 기본 프로필 이미지
  });

  // 회사 정보 상태 관리
  const [companyData, setCompanyData] = useState({
    companyName: "",
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
  const [error, setError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    // TODO: 실제 API에서 사용자 정보 가져오기
    // const fetchUserProfile = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await fetch('/api/user/profile', {
    //       headers: { 'Authorization': `Bearer ${token}` },
    //     });
    //     const data = await response.json();
    //     setProfileData({
    //       name: data.name,
    //       email: data.email,
    //       phone: data.phone,
    //       profileImage: data.profileImage || '/search/profile.jpg',
    //     });
    //   } catch (err) {
    //     console.error('프로필 로드 실패:', err);
    //   }
    // };
    // fetchUserProfile();

    // 임시: 기본 데이터 설정
    setProfileData({
      name: "김수환",
      email: "suhwan0219@gmail.com",
      phone: "010-6579-2424",
      profileImage: "/search/profile.jpg",
    });

    // TODO: 실제 API에서 회사 정보 가져오기
    // const fetchCompanyInfo = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await fetch('/api/user/company', {
    //       headers: { 'Authorization': `Bearer ${token}` },
    //     });
    //     const data = await response.json();
    //     setCompanyData({
    //       companyName: data.companyName,
    //       businessNumber: data.businessNumber,
    //       representative: data.representative,
    //       companyPhone: data.companyPhone,
    //       companyEmail: data.companyEmail,
    //       address: data.address,
    //       website: data.website || '',
    //     });
    //   } catch (err) {
    //     console.error('회사 정보 로드 실패:', err);
    //   }
    // };
    // fetchCompanyInfo();

    // 임시: 기본 회사 데이터 설정
    setCompanyData({
      companyName: "힐스테이트 황금엘포레 부동산",
      businessNumber: "123-45-67890",
      representative: "김수환",
      companyPhone: "(053) 792-7777",
      companyEmail: "suhwan0219@gmail.com",
      address: "대구광역시 수성구 황금동",
      website: "",
    });
  }, []);

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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 정보 저장 핸들러
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 입력값 유효성 검사
    if (!profileData.name || !profileData.email || !profileData.phone) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
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
      // TODO: 실제 API 호출로 대체 필요
      // const token = localStorage.getItem('token');
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(profileData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('프로필 업데이트에 실패했습니다.');
      // }

      // 임시: 성공 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("프로필 업데이트:", profileData);

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

    // 필수 필드 검사
    if (
      !companyData.companyName ||
      !companyData.businessNumber ||
      !companyData.representative ||
      !companyData.companyPhone ||
      !companyData.companyEmail ||
      !companyData.address
    ) {
      setCompanyError("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyData.companyEmail)) {
      setCompanyError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 사업자등록번호 형식 검사 (숫자와 하이픈만 허용)
    const businessNumberRegex = /^[0-9-]+$/;
    if (!businessNumberRegex.test(companyData.businessNumber)) {
      setCompanyError("올바른 사업자등록번호 형식을 입력해주세요.");
      return;
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
      // TODO: 실제 API 호출로 대체 필요
      // const token = localStorage.getItem('token');
      // const response = await fetch('/api/user/company', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(companyData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('회사 정보 업데이트에 실패했습니다.');
      // }

      // 임시: 성공 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("회사 정보 업데이트:", companyData);

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
      // TODO: 실제 API 호출로 대체 필요
      // const token = localStorage.getItem('token');
      // const response = await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('비밀번호 변경에 실패했습니다.');
      // }

      // 임시: 성공 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("비밀번호 변경 시도");

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
                <Image
                  src={profileData.profileImage}
                  alt="프로필 이미지"
                  fill
                  className="object-cover"
                />
              </div>
              <label
                htmlFor="profile-image"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors cursor-pointer text-sm"
              >
                <Camera className="w-4 h-4" />
                이미지 변경
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
                    value={profileData.name}
                    onChange={handleProfileChange}
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
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="이메일을 입력하세요"
                    disabled={isLoading}
                  />
                </div>
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
                    value={profileData.phone}
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
                    value={companyData.companyName}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="회사명을 입력하세요"
                    disabled={isCompanyLoading}
                  />
                </div>
              </div>

              {/* 사업자등록번호 입력 */}
              <div>
                <label
                  htmlFor="businessNumber"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  사업자등록번호 <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="businessNumber"
                    name="businessNumber"
                    type="text"
                    required
                    value={companyData.businessNumber}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="사업자등록번호를 입력하세요 (예: 123-45-67890)"
                    disabled={isCompanyLoading}
                  />
                </div>
              </div>

              {/* 대표자명 입력 */}
              <div>
                <label
                  htmlFor="representative"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  대표자명 <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="representative"
                    name="representative"
                    type="text"
                    required
                    value={companyData.representative}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="대표자명을 입력하세요"
                    disabled={isCompanyLoading}
                  />
                </div>
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
                    value={companyData.companyPhone}
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
                  회사 이메일 <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    required
                    value={companyData.companyEmail}
                    onChange={handleCompanyChange}
                    className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="회사 이메일을 입력하세요"
                    disabled={isCompanyLoading}
                  />
                </div>
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
                    value={companyData.address}
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
                    value={companyData.website}
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
