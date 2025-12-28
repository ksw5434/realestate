"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, Trash2, MapPin, Building } from "lucide-react";
import { getProperty, deleteProperty } from "../actions";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");
      const result = await getProperty(id);
      setLoading(false);

      if (result.success && result.property) {
        setProperty(result.property);
      } else {
        setError(result.error || "매물을 불러오는데 실패했습니다.");
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("정말 이 매물을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProperty(id);
    setIsDeleting(false);

    if (result.success) {
      router.push("/dashboard/properties");
    } else {
      alert(result.error || "삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">매물 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <p className="text-destructive mb-4">{error || "매물을 찾을 수 없습니다."}</p>
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로 돌아가기
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
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/properties/${id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              <Edit className="w-4 h-4" />
              수정
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>

        {/* 이미지 갤러리 */}
        {property.images && property.images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((image: any, index: number) => (
                <div
                  key={image.id}
                  className="relative aspect-video bg-muted rounded-lg overflow-hidden"
                >
                  <Image
                    src={image.image_url}
                    alt={`${property.title} - 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 기본 정보 */}
        <div className="border border-border rounded-lg p-6 bg-card mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {property.title}
          </h1>
          {property.subtitle && (
            <p className="text-lg text-muted-foreground mb-4">
              {property.subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-muted text-foreground text-sm font-medium rounded-md">
              매물번호 {property.property_number}
            </span>
          </div>
          <div className="text-2xl font-bold text-primary mb-4">
            {property.price}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{property.address}</span>
          </div>
        </div>

        {/* 스펙 정보 */}
        {(property.area ||
          property.rooms ||
          property.floor ||
          property.direction) && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              스펙 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.area && (
                <div>
                  <span className="text-sm text-muted-foreground">면적</span>
                  <p className="text-foreground">{property.area}</p>
                </div>
              )}
              {property.rooms && (
                <div>
                  <span className="text-sm text-muted-foreground">방 정보</span>
                  <p className="text-foreground">{property.rooms}</p>
                </div>
              )}
              {property.floor && (
                <div>
                  <span className="text-sm text-muted-foreground">층 정보</span>
                  <p className="text-foreground">{property.floor}</p>
                </div>
              )}
              {property.direction && (
                <div>
                  <span className="text-sm text-muted-foreground">방향</span>
                  <p className="text-foreground">{property.direction}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 상세 정보 */}
        {(property.supply_area ||
          property.floor_info ||
          property.rooms_baths ||
          property.move_in_date ||
          property.entrance_structure ||
          property.maintenance_fee ||
          property.heating_method ||
          property.approval_date ||
          property.total_households ||
          property.total_parking ||
          property.constructor) && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              상세 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.supply_area && (
                <div>
                  <span className="text-sm text-muted-foreground">공급면적</span>
                  <p className="text-foreground">{property.supply_area}</p>
                </div>
              )}
              {property.floor_info && (
                <div>
                  <span className="text-sm text-muted-foreground">해당층/총층</span>
                  <p className="text-foreground">{property.floor_info}</p>
                </div>
              )}
              {property.rooms_baths && (
                <div>
                  <span className="text-sm text-muted-foreground">방/욕실</span>
                  <p className="text-foreground">{property.rooms_baths}</p>
                </div>
              )}
              {property.move_in_date && (
                <div>
                  <span className="text-sm text-muted-foreground">입주가능일</span>
                  <p className="text-foreground">{property.move_in_date}</p>
                </div>
              )}
              {property.entrance_structure && (
                <div>
                  <span className="text-sm text-muted-foreground">현관구조</span>
                  <p className="text-foreground">{property.entrance_structure}</p>
                </div>
              )}
              {property.has_basic_options && (
                <div>
                  <span className="text-sm text-muted-foreground">기본옵션</span>
                  <p className="text-foreground">있음</p>
                </div>
              )}
              {property.maintenance_fee && (
                <div>
                  <span className="text-sm text-muted-foreground">관리비</span>
                  <p className="text-foreground">{property.maintenance_fee}</p>
                </div>
              )}
              {property.heating_method && (
                <div>
                  <span className="text-sm text-muted-foreground">난방방식</span>
                  <p className="text-foreground">{property.heating_method}</p>
                </div>
              )}
              {property.approval_date && (
                <div>
                  <span className="text-sm text-muted-foreground">사용승인일</span>
                  <p className="text-foreground">{property.approval_date}</p>
                </div>
              )}
              {property.total_households && (
                <div>
                  <span className="text-sm text-muted-foreground">총세대수</span>
                  <p className="text-foreground">{property.total_households}</p>
                </div>
              )}
              {property.total_parking && (
                <div>
                  <span className="text-sm text-muted-foreground">총주차대수</span>
                  <p className="text-foreground">{property.total_parking}</p>
                </div>
              )}
              {property.constructor && (
                <div>
                  <span className="text-sm text-muted-foreground">건설사</span>
                  <p className="text-foreground">{property.constructor}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 매물 설명 */}
        {property.descriptions &&
          property.descriptions.length > 0 &&
          property.descriptions.some((desc: string) => desc.trim() !== "") && (
            <div className="border border-border rounded-lg p-6 bg-card mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                매물 설명
              </h2>
              <div className="space-y-3">
                {property.descriptions.map(
                  (desc: string, index: number) =>
                    desc.trim() !== "" && (
                      <p key={index} className="text-foreground whitespace-pre-wrap">
                        {desc}
                      </p>
                    )
                )}
              </div>
            </div>
          )}

        {/* 주변시설 */}
        {property.facilities &&
          Object.keys(property.facilities).length > 0 && (
            <div className="border border-border rounded-lg p-6 bg-card mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                주변시설
              </h2>
              <div className="space-y-4">
                {property.facilities.education &&
                  property.facilities.education.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        교육시설
                      </h3>
                      <ul className="space-y-1">
                        {property.facilities.education.map(
                          (item: string, index: number) => (
                            <li key={index} className="text-foreground">
                              • {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {property.facilities.shopping &&
                  property.facilities.shopping.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        쇼핑/편의시설
                      </h3>
                      <ul className="space-y-1">
                        {property.facilities.shopping.map(
                          (item: string, index: number) => (
                            <li key={index} className="text-foreground">
                              • {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {property.facilities.medical &&
                  property.facilities.medical.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        의료시설
                      </h3>
                      <ul className="space-y-1">
                        {property.facilities.medical.map(
                          (item: string, index: number) => (
                            <li key={index} className="text-foreground">
                              • {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {property.facilities.transportation &&
                  property.facilities.transportation.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        교통
                      </h3>
                      <ul className="space-y-1">
                        {property.facilities.transportation.map(
                          (item: string, index: number) => (
                            <li key={index} className="text-foreground">
                              • {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}

        {/* 재무 정보 */}
        {property.financial_info && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              재무 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.financial_info.acquisition_tax && (
                <div>
                  <span className="text-sm text-muted-foreground">취득세</span>
                  <p className="text-foreground">
                    {property.financial_info.acquisition_tax}
                  </p>
                </div>
              )}
              {property.financial_info.acquisition_tax_note && (
                <div>
                  <span className="text-sm text-muted-foreground">취득세 비고</span>
                  <p className="text-foreground">
                    {property.financial_info.acquisition_tax_note}
                  </p>
                </div>
              )}
              {property.financial_info.brokerage_fee_sale && (
                <div>
                  <span className="text-sm text-muted-foreground">중개보수 (매매시)</span>
                  <p className="text-foreground">
                    {property.financial_info.brokerage_fee_sale}
                  </p>
                </div>
              )}
              {property.financial_info.brokerage_fee_rent && (
                <div>
                  <span className="text-sm text-muted-foreground">중개보수 (전월세시)</span>
                  <p className="text-foreground">
                    {property.financial_info.brokerage_fee_rent}
                  </p>
                </div>
              )}
              {property.financial_info.brokerage_fee_note && (
                <div className="md:col-span-2">
                  <span className="text-sm text-muted-foreground">중개보수 비고</span>
                  <p className="text-foreground">
                    {property.financial_info.brokerage_fee_note}
                  </p>
                </div>
              )}
              {property.financial_info.disclaimer && (
                <div className="md:col-span-2">
                  <span className="text-sm text-muted-foreground">면책조항</span>
                  <p className="text-foreground">
                    {property.financial_info.disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 지도 URL */}
        {property.map_url && (
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              지도
            </h2>
            <a
              href={property.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              지도 보기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

