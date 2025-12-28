"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getAllProperties } from "./actions";
import { PropertyCard, Property } from "@/app/_components/PropertyCard";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");
      const result = await getAllProperties();
      setLoading(false);

      if (result.success && result.properties) {
        setProperties(result.properties);
      } else {
        setError(result.error || "매물 목록을 불러오는데 실패했습니다.");
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">매물 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* 페이지 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            등록된 매물
          </h1>
          <p className="text-muted-foreground">
            총 {properties.length}개의 매물이 등록되어 있습니다.
          </p>
        </div>
        {/* 글쓰기 버튼 */}
        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>글쓰기</span>
        </Link>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
          {error}
        </div>
      )}

      {/* 매물 카드 그리드 */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">등록된 매물이 없습니다.</p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />첫 매물 등록하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
