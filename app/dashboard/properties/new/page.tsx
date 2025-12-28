"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAdmin, getCurrentUser } from "@/lib/auth";
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Upload,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { createProperty } from "../actions";
import { createClient } from "@/lib/supabase/client";
import PostCode from "react-daum-postcode";

export default function NewPropertyPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(
    new Set()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddrModal, setShowAddrModal] = useState(false); // 주소 검색 모달 상태

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    // 기본 정보
    propertyNumber: "",
    title: "",
    subtitle: "",
    price: "",

    // 스펙 정보
    area: "",
    rooms: "",
    floor: "",
    direction: "",

    // 상세 정보
    supplyArea: "",
    floorInfo: "",
    roomsBaths: "",
    moveInDate: "",
    entranceStructure: "",
    hasBasicOptions: false,
    maintenanceFee: "",
    heatingMethod: "",
    approvalDate: "",
    totalHouseholds: "",
    totalParking: "",
    constructor: "",

    // 설명 (배열)
    descriptions: [""],

    // 위치 정보
    zonecode: "", // 우편번호
    address: "", // 기본 주소
    detailAddress: "", // 상세 주소
    mapUrl: "",

    // 주변시설 정보
    facilities: {
      education: [""],
      shopping: [""],
      medical: [""],
      transportation: [""],
    },

    // 재무 정보
    financialInfo: {
      acquisitionTax: "",
      acquisitionTaxNote: "",
      brokerageFeeSale: "",
      brokerageFeeRent: "",
      brokerageFeeNote: "",
      disclaimer: "",
    },

    // 이미지 URL들
    imageUrls: [] as string[],
  });

  // 관리자 권한 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const adminStatus = await isAdmin();
        if (!adminStatus) {
          setError("관리자 권한이 필요합니다.");
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error("권한 확인 중 오류:", err);
        setError("권한 확인 중 오류가 발생했습니다.");
        setIsAuthorized(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // 설명 항목 추가
  const addDescription = () => {
    setFormData({
      ...formData,
      descriptions: [...formData.descriptions, ""],
    });
  };

  // 설명 항목 제거
  const removeDescription = (index: number) => {
    setFormData({
      ...formData,
      descriptions: formData.descriptions.filter((_, i) => i !== index),
    });
  };

  // 설명 항목 업데이트
  const updateDescription = (index: number, value: string) => {
    const newDescriptions = [...formData.descriptions];
    newDescriptions[index] = value;
    setFormData({ ...formData, descriptions: newDescriptions });
  };

  // 주변시설 항목 추가
  const addFacility = (category: keyof typeof formData.facilities) => {
    setFormData({
      ...formData,
      facilities: {
        ...formData.facilities,
        [category]: [...formData.facilities[category], ""],
      },
    });
  };

  // 주변시설 항목 제거
  const removeFacility = (
    category: keyof typeof formData.facilities,
    index: number
  ) => {
    setFormData({
      ...formData,
      facilities: {
        ...formData.facilities,
        [category]: formData.facilities[category].filter((_, i) => i !== index),
      },
    });
  };

  // 주변시설 항목 업데이트
  const updateFacility = (
    category: keyof typeof formData.facilities,
    index: number,
    value: string
  ) => {
    const newFacilities = { ...formData.facilities };
    newFacilities[category] = [...newFacilities[category]];
    newFacilities[category][index] = value;
    setFormData({ ...formData, facilities: newFacilities });
  };

  // 이미지 URL 추가
  const addImageUrl = () => {
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ""],
    });
  };

  // 이미지 URL 제거
  const removeImageUrl = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // 이미지 URL 업데이트
  const updateImageUrl = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  // 파일을 이미지 URL로 변환하는 함수
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const supabase = createClient();

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("로그인이 필요합니다.");
      return;
    }

    // 각 파일을 순차적으로 업로드
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 이미지 파일인지 확인
      if (!file.type.startsWith("image/")) {
        setError(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        continue;
      }

      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name}의 크기가 너무 큽니다. (최대 10MB)`);
        continue;
      }

      // 임시 인덱스 생성 (업로드 중 표시용)
      const tempIndex = formData.imageUrls.length;
      setUploadingImages((prev) => new Set(prev).add(tempIndex));

      try {
        // 파일 확장자 추출
        const fileExt = file.name.split(".").pop();
        const fileName = `property-${user.id}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `property-images/${fileName}`;

        // Supabase Storage에 파일 업로드
        const { error: uploadError } = await supabase.storage
          .from("properties") // 매물 이미지 전용 버킷 사용
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            uploadError.message || "이미지 업로드에 실패했습니다."
          );
        }

        // 업로드된 파일의 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("properties").getPublicUrl(filePath);

        // 이미지 URL 배열에 추가
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, publicUrl],
        }));

        setUploadingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tempIndex);
          return newSet;
        });
      } catch (err) {
        console.error("이미지 업로드 오류:", err);
        setError(
          err instanceof Error
            ? err.message
            : `${file.name} 업로드 중 오류가 발생했습니다.`
        );
        setUploadingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tempIndex);
          return newSet;
        });
      }
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    // 같은 파일을 다시 선택할 수 있도록 리셋
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 주소 검색 모달 열기
  const openAddrModal = () => {
    setShowAddrModal(true);
  };

  // 주소 검색 모달 닫기
  const closeAddrModal = () => {
    setShowAddrModal(false);
  };

  // Daum 주소 API 완료 핸들러
  const handleAddressComplete = (data: any) => {
    let fullAddress = data.address; // 기본 주소
    let extraAddress = ""; // 참고항목

    const { addressType, bname, buildingName, zonecode } = data;

    // 도로명 주소인 경우 참고항목 추가
    if (addressType === "R") {
      if (bname !== "") {
        extraAddress += bname;
      }
      if (buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${buildingName}` : buildingName;
      }
      fullAddress += extraAddress !== "" ? ` ${extraAddress}` : "";
    }

    // 폼 데이터 업데이트
    setFormData({
      ...formData,
      zonecode: zonecode,
      address: fullAddress,
    });

    // 모달 닫기
    setShowAddrModal(false);
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // 필수 필드 검증
      if (
        !formData.propertyNumber ||
        !formData.title ||
        !formData.price ||
        !formData.address
      ) {
        setError("필수 항목을 모두 입력해주세요. (매물번호, 제목, 가격, 주소)");
        setIsSubmitting(false);
        return;
      }

      // 설명 배열에서 빈 항목 제거
      const descriptions = formData.descriptions.filter(
        (desc) => desc.trim() !== ""
      );

      // 주변시설 객체 생성 (빈 배열 제거)
      const facilities: Record<string, string[]> = {};
      Object.entries(formData.facilities).forEach(([key, values]) => {
        const filtered = values.filter((v) => v.trim() !== "");
        if (filtered.length > 0) {
          facilities[key] = filtered;
        }
      });

      // 이미지 URL 배열에서 빈 항목 제거
      const imageUrls = formData.imageUrls.filter((url) => url.trim() !== "");

      // 주소 합치기 (기본 주소 + 상세 주소)
      const fullAddress = formData.detailAddress
        ? `${formData.address} ${formData.detailAddress}`.trim()
        : formData.address;

      // 데이터 저장
      const result = await createProperty({
        ...formData,
        address: fullAddress, // 합쳐진 주소로 저장
        descriptions,
        facilities,
        imageUrls,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("매물이 성공적으로 등록되었습니다!");
        // 2초 후 목록 페이지로 이동 (또는 상세 페이지로)
        setTimeout(() => {
          router.push("/dashboard/properties");
        }, 2000);
      }
    } catch (err) {
      console.error("매물 등록 중 오류:", err);
      setError("매물 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중이거나 권한이 없으면 표시
  if (isCheckingAuth) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">권한 확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <h2 className="text-xl font-semibold text-destructive">
                접근 권한 없음
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              새 매물 등록
            </h1>
            <p className="text-muted-foreground">
              부동산 매물 정보를 입력해주세요
            </p>
          </div>
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Link>
        </div>

        {/* 에러/성공 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-md text-green-600 dark:text-green-400">
            {success}
          </div>
        )}

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 이미지 업로드 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                이미지 업로드
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleFileButtonClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  파일 선택
                </button>
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  URL 추가
                </button>
              </div>
            </div>

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* 드래그 앤 드롭 영역 */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileButtonClick}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }
              `}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-muted">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    이미지를 드래그하여 놓거나 클릭하여 선택하세요
                  </p>
                  <p className="text-xs text-muted-foreground">
                    지원 형식: JPG, PNG, GIF, WEBP (최대 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* 업로드된 이미지 목록 */}
            {formData.imageUrls.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  업로드된 이미지 ({formData.imageUrls.length}개)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group border border-border rounded-lg overflow-hidden bg-muted"
                    >
                      {/* 업로드 중 표시 */}
                      {uploadingImages.has(index) && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-xs text-muted-foreground">
                              업로드 중...
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 이미지 미리보기 */}
                      <div className="aspect-video relative">
                        <img
                          src={url}
                          alt={`이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // 이미지 로드 실패 시 대체 UI 표시
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                  이미지를 불러올 수 없습니다
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>

                      {/* 이미지 URL 입력 및 삭제 버튼 */}
                      <div className="p-3 space-y-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) =>
                            updateImageUrl(index, e.target.value)
                          }
                          placeholder="이미지 URL"
                          className="w-full px-2 py-1 text-xs border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="w-full px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          <X className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 기본 정보 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              기본 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  매물번호 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.propertyNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  제목 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  부제목
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  가격 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="예: 매매 26억 6,000만원"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* 스펙 정보 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              스펙 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  면적
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="예: 84.72 | 109.88m²"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  방 정보
                </label>
                <input
                  type="text"
                  value={formData.rooms}
                  onChange={(e) =>
                    setFormData({ ...formData, rooms: e.target.value })
                  }
                  placeholder="예: 방3개, 욕실2개"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  층 정보
                </label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  placeholder="예: 고층/35층"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  방향
                </label>
                <input
                  type="text"
                  value={formData.direction}
                  onChange={(e) =>
                    setFormData({ ...formData, direction: e.target.value })
                  }
                  placeholder="예: 남향"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              상세 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  공급면적
                </label>
                <input
                  type="text"
                  value={formData.supplyArea}
                  onChange={(e) =>
                    setFormData({ ...formData, supplyArea: e.target.value })
                  }
                  placeholder="예: 84.72 | 109.88m²"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  해당층/총층
                </label>
                <input
                  type="text"
                  value={formData.floorInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, floorInfo: e.target.value })
                  }
                  placeholder="예: 고층/35층"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  방/욕실
                </label>
                <input
                  type="text"
                  value={formData.roomsBaths}
                  onChange={(e) =>
                    setFormData({ ...formData, roomsBaths: e.target.value })
                  }
                  placeholder="예: 방3개, 욕실2개"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  입주가능일
                </label>
                <input
                  type="text"
                  value={formData.moveInDate}
                  onChange={(e) =>
                    setFormData({ ...formData, moveInDate: e.target.value })
                  }
                  placeholder="예: 즉시입주 (협의가능)"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  방향 (상세)
                </label>
                <input
                  type="text"
                  value={formData.direction}
                  onChange={(e) =>
                    setFormData({ ...formData, direction: e.target.value })
                  }
                  placeholder="예: 남향(거실기준)"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  현관구조
                </label>
                <input
                  type="text"
                  value={formData.entranceStructure}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entranceStructure: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasBasicOptions"
                  checked={formData.hasBasicOptions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasBasicOptions: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor="hasBasicOptions"
                  className="text-sm font-medium text-foreground"
                >
                  기본옵션정보 있음
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  관리비
                </label>
                <input
                  type="text"
                  value={formData.maintenanceFee}
                  onChange={(e) =>
                    setFormData({ ...formData, maintenanceFee: e.target.value })
                  }
                  placeholder="예: 월 260,000원"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  난방방식
                </label>
                <input
                  type="text"
                  value={formData.heatingMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, heatingMethod: e.target.value })
                  }
                  placeholder="예: 개별난방"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  사용승인일
                </label>
                <input
                  type="text"
                  value={formData.approvalDate}
                  onChange={(e) =>
                    setFormData({ ...formData, approvalDate: e.target.value })
                  }
                  placeholder="예: 2009년 10월 24일"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  총세대수
                </label>
                <input
                  type="text"
                  value={formData.totalHouseholds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalHouseholds: e.target.value,
                    })
                  }
                  placeholder="예: 2444세대"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  총주차대수
                </label>
                <input
                  type="text"
                  value={formData.totalParking}
                  onChange={(e) =>
                    setFormData({ ...formData, totalParking: e.target.value })
                  }
                  placeholder="예: 79p"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  건설사
                </label>
                <input
                  type="text"
                  value={formData.constructor}
                  onChange={(e) =>
                    setFormData({ ...formData, constructor: e.target.value })
                  }
                  placeholder="예: GS건설"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 매물 설명 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                매물 설명
              </h2>
              <button
                type="button"
                onClick={addDescription}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>
            <div className="space-y-3">
              {formData.descriptions.map((desc, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={desc}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    rows={3}
                    className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="매물 설명을 입력하세요"
                  />
                  {formData.descriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDescription(index)}
                      className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 위치 정보 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              위치 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  주소 <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-row gap-3 mb-3">
                  {/* 우편번호 표시 필드 */}
                  <div className="flex items-center justify-center border border-input rounded-md w-[120px] h-[42px] text-foreground pointer-events-none bg-muted">
                    {formData.zonecode || "우편번호"}
                  </div>
                  {/* 주소 찾기 버튼 */}
                  <button
                    type="button"
                    onClick={openAddrModal}
                    className="bg-primary text-primary-foreground rounded-md w-fit h-[42px] px-4 py-2 hover:bg-primary/90 transition-colors"
                  >
                    주소 찾기
                  </button>
                </div>
                {/* 기본 주소 입력 필드 (읽기 전용) */}
                <input
                  type="text"
                  value={formData.address}
                  readOnly
                  placeholder="주소 찾기 버튼을 클릭하여 주소를 검색하세요"
                  className="w-full px-3 py-2 border border-input rounded-md bg-muted text-foreground mb-3 cursor-not-allowed"
                  required
                />
                {/* 상세 주소 입력 필드 */}
                <input
                  type="text"
                  value={formData.detailAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, detailAddress: e.target.value })
                  }
                  placeholder="상세주소를 입력해주세요 (예: 101동 101호)"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {/* 주소 검색 모달 */}
                {showAddrModal && (
                  <div
                    onClick={closeAddrModal}
                    className="fixed top-0 left-0 w-full h-full z-[101] bg-black/50 flex items-center justify-center"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-[1000]"
                    >
                      <PostCode onComplete={handleAddressComplete} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  지도 URL
                </label>
                <input
                  type="url"
                  value={formData.mapUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, mapUrl: e.target.value })
                  }
                  placeholder="예: https://map.naver.com/..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 주변시설 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              주변시설
            </h2>
            <div className="space-y-6">
              {(
                ["education", "shopping", "medical", "transportation"] as const
              ).map((category) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">
                      {category === "education" && "교육시설"}
                      {category === "shopping" && "쇼핑/편의시설"}
                      {category === "medical" && "의료시설"}
                      {category === "transportation" && "교통"}
                    </label>
                    <button
                      type="button"
                      onClick={() => addFacility(category)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border rounded-md hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.facilities[category].map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateFacility(category, index, e.target.value)
                          }
                          placeholder={`예: 반포초등학교 (도보 5분)`}
                          className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {formData.facilities[category].length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFacility(category, index)}
                            className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 재무 정보 섹션 */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              재무 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  취득세
                </label>
                <input
                  type="text"
                  value={formData.financialInfo.acquisitionTax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financialInfo: {
                        ...formData.financialInfo,
                        acquisitionTax: e.target.value,
                      },
                    })
                  }
                  placeholder="예: 8,504만원"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  취득세 비고
                </label>
                <input
                  type="text"
                  value={formData.financialInfo.acquisitionTaxNote}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financialInfo: {
                        ...formData.financialInfo,
                        acquisitionTaxNote: e.target.value,
                      },
                    })
                  }
                  placeholder="예: 부가세 별도"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  중개보수 (매매시)
                </label>
                <input
                  type="text"
                  value={formData.financialInfo.brokerageFeeSale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financialInfo: {
                        ...formData.financialInfo,
                        brokerageFeeSale: e.target.value,
                      },
                    })
                  }
                  placeholder="예: 2,394만원"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  중개보수 (전월세시)
                </label>
                <input
                  type="text"
                  value={formData.financialInfo.brokerageFeeRent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financialInfo: {
                        ...formData.financialInfo,
                        brokerageFeeRent: e.target.value,
                      },
                    })
                  }
                  placeholder="예: 1,280만원"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  중개보수 비고
                </label>
                <input
                  type="text"
                  value={formData.financialInfo.brokerageFeeNote}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financialInfo: {
                        ...formData.financialInfo,
                        brokerageFeeNote: e.target.value,
                      },
                    })
                  }
                  placeholder="예: 부가세 별도"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  면책조항
                </label>
                <input
                  type="text"
                  value={formData.financialInfo.disclaimer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financialInfo: {
                        ...formData.financialInfo,
                        disclaimer: e.target.value,
                      },
                    })
                  }
                  placeholder="예: *중개보수 및 세금정보는 실제와 상이할 수 있습니다."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/dashboard/properties"
              className="px-6 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  저장
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
