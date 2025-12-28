"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Edit, Trash2, Eye } from "lucide-react";
import { deleteProperty } from "@/app/dashboard/properties/actions";

// 작성자 정보 타입 정의
export interface Creator {
  id: string;
  name: string | null;
  phone: string | null;
  company_name: string | null;
  company_phone: string | null;
  company_email: string | null;
}

// 매물 타입 정의
export interface Property {
  id: string;
  property_number: string;
  title: string;
  subtitle: string | null;
  price: string;
  address: string;
  imageUrl: string | null;
  created_at: string;
  creator?: Creator | null; // 작성자 정보 (선택적)
}

// PropertyCard 컴포넌트 Props 타입
interface PropertyCardProps {
  property: Property;
  onDelete: (id: string) => void;
  variant?: "dashboard" | "search"; // 카드 사용 용도 (대시보드 또는 검색)
  onClick?: () => void; // 카드 클릭 핸들러 (검색 페이지용)
}

/**
 * 매물 카드 컴포넌트
 * 매물 정보를 카드 형태로 표시하고, 보기/수정/삭제 기능을 제공합니다.
 */
export function PropertyCard({
  property,
  onDelete,
  variant = "dashboard",
  onClick,
}: PropertyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 매물 삭제 핸들러
  const handleDelete = async () => {
    // 삭제 확인
    if (!confirm("정말 이 매물을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProperty(property.id);
      
      if (result.success) {
        // 삭제 성공 시 부모 컴포넌트에 알림
        onDelete(property.id);
      } else {
        // 삭제 실패 시 에러 메시지 표시
        alert(result.error || "삭제에 실패했습니다.");
      }
    } catch (error) {
      // 예외 처리
      console.error("매물 삭제 중 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 검색 페이지용 클릭 핸들러
  const handleCardClick = (e: React.MouseEvent) => {
    // 내부 버튼이나 링크를 클릭한 경우는 카드 클릭으로 처리하지 않음
    const target = e.target as HTMLElement;
    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("[role='button']")
    ) {
      return;
    }
    onClick?.();
  };

  return (
    <div
      className={`bg-white dark:bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
        variant === "search" && onClick ? "cursor-pointer" : ""
      }`}
      onClick={variant === "search" ? handleCardClick : undefined}
    >
      {/* 이미지 영역 */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-muted">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            이미지 없음
          </div>
        )}
      </div>

      {/* 매물 정보 영역 */}
      <div className="p-4 space-y-3">
        {/* 매물번호 */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-muted text-foreground text-sm font-medium rounded-md">
            매물번호 {property.property_number}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
          {property.title}
        </h3>

        {/* 부제목 */}
        {property.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {property.subtitle}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">
            {property.price}
          </span>
        </div>

        {/* 위치 */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        {/* 작성자 정보 */}
        {property.creator && (
          <div className="text-xs text-muted-foreground pt-1 border-t border-border">
            <span className="font-medium">등록자: </span>
            <span>
              {property.creator.name || property.creator.company_name || "정보 없음"}
            </span>
            {property.creator.company_name && property.creator.name && (
              <span className="ml-1">({property.creator.company_name})</span>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        {variant === "dashboard" ? (
          // 대시보드용: 보기/수정/삭제 버튼 표시
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Link
              href={`/dashboard/properties/${property.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Eye className="w-4 h-4" />
              보기
            </Link>
            <Link
              href={`/dashboard/properties/${property.id}/edit`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              <Edit className="w-4 h-4" />
              수정
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="매물 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // 검색 페이지용: 간단한 보기 버튼만 표시
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <div className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md">
              <Eye className="w-4 h-4" />
              상세보기
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

