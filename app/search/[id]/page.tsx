"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Bell,
  Star,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { getProperty } from "@/app/dashboard/properties/actions";
// 카카오맵 타입 정의는 lib/types/kakao.d.ts에서 자동으로 인식됩니다

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  // 이미지 갤러리 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 네비게이션 탭 상태 관리
  const [activeTab, setActiveTab] = useState("info");
  // 스크롤 중인지 추적 (프로그래밍 방식 스크롤 중에는 탭 업데이트 방지)
  const isScrollingRef = useRef(false);
  // 매물 데이터 및 로딩 상태
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 지도 관련 ref 및 상태
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // 매물 데이터 가져오기
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;

      setLoading(true);
      setError("");
      try {
        const result = await getProperty(propertyId);
        if (result.success && result.property) {
          setProperty(result.property);
          // 이미지가 있으면 첫 번째 이미지로 설정
          if (result.property.images && result.property.images.length > 0) {
            setCurrentImageIndex(0);
          }
        } else {
          setError(result.error || "매물을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("매물 조회 중 오류:", err);
        setError("매물을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // 이미지 배열 생성 (실제 이미지가 있으면 사용, 없으면 샘플 이미지)
  const propertyImages: string[] =
    property?.images && property.images.length > 0
      ? property.images.map((img: any) => img.image_url)
      : property?.imageUrl
      ? [property.imageUrl]
      : ["/search/1.jpg", "/search/2.jpg", "/search/3.jpg"];

  // 매물 정보 변환 함수
  const getPropertyInfo = () => {
    if (!property) return null;

    return {
      title: property.title || "",
      subtitle: property.subtitle || "",
      price: property.price || "",
      specs: {
        area: property.area || "",
        rooms: property.rooms || "",
        floor: property.floor || "",
        direction: property.direction || "",
      },
      details: {
        supplyArea: property.supply_area || "",
        floorInfo: property.floor_info || "",
        roomsBaths: property.rooms_baths || "",
        moveInDate: property.move_in_date || "",
        direction: property.direction || "",
        entranceStructure: property.entrance_structure || "",
        basicOptions: property.has_basic_options || false,
        maintenanceFee: property.maintenance_fee || "",
        heatingMethod: property.heating_method || "",
        approvalDate: property.approval_date || "",
        totalHouseholds: property.total_households || "",
        totalParking: property.total_parking || "",
        constructor: property.constructor || "",
        propertyNumber: property.property_number || "",
      },
      description:
        property.descriptions && Array.isArray(property.descriptions)
          ? property.descriptions
          : property.descriptions
          ? [property.descriptions]
          : ["매물 설명이 없습니다."],
      financial: property.financial_info || {
        acquisitionTax: "",
        acquisitionTaxNote: "",
        brokerageFeeSale: "",
        brokerageFeeRent: "",
        brokerageFeeNote: "",
        disclaimer: "*중개보수 및 세금정보는 실제와 상이할 수 있습니다.",
      },
      location: {
        address: property.address || "",
        mapUrl: property.map_url || "#",
      },
    };
  };

  const propertyInfo = getPropertyInfo();

  // 작성자 정보 (매물 등록자 정보)
  const creatorInfo = property?.creator
    ? {
        name: property.creator.name || "이름 없음",
        companyName: property.creator.company_name || "",
        phone: property.creator.phone || property.creator.company_phone || "",
        email: property.creator.company_email || "",
        image: "/search/profile.jpg", // 프로필 이미지는 추후 추가 가능
      }
    : {
        name: "정보 없음",
        companyName: "",
        phone: "",
        email: "",
        image: "/search/profile.jpg",
      };

  // 이미지 갤러리 네비게이션
  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 탭 클릭 시 해당 섹션으로 스크롤하는 함수
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    isScrollingRef.current = true; // 스크롤 시작 표시
    const element = document.getElementById(tabId);
    if (element) {
      // 네비게이션 바 높이만큼 오프셋을 주어 정확한 위치로 스크롤
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // 스크롤 완료 후 플래그 해제 (약간의 지연을 두어 스크롤 완료 대기)
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  // Intersection Observer를 사용하여 현재 보이는 섹션 감지
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px", // 상단에서 100px 아래부터 감지
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // 프로그래밍 방식 스크롤 중이면 탭 업데이트하지 않음
      if (isScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (
            sectionId &&
            ["info", "description", "location", "others"].includes(sectionId)
          ) {
            setActiveTab(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // 모든 섹션 관찰 시작
    const sections = ["info", "description", "location", "others"];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [property]);

  // 지도 초기화 함수 (useCallback으로 메모이제이션)
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || !propertyInfo?.location?.address) return;
    if (mapRef.current) return; // 이미 지도가 생성되어 있으면 중복 생성 방지

    try {
      // 주소를 좌표로 변환 (Geocoding)
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(
        propertyInfo.location.address,
        (result: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            // 주소 검색 성공 시
            const coords = new window.kakao.maps.LatLng(
              parseFloat(result[0].y),
              parseFloat(result[0].x)
            );

            // 지도 옵션 설정
            const mapOption = {
              center: coords, // 지도의 중심좌표
              level: 1, // 지도의 확대 레벨 (숫자가 작을수록 확대)
            };

            // 지도 생성
            const map = new window.kakao.maps.Map(
              mapContainerRef.current!,
              mapOption
            );

            mapRef.current = map;

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
              position: coords,
              map: map,
            });

            // 인포윈도우 생성
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:8px;font-size:12px;min-width:150px;text-align:center;">${propertyInfo.location.address}</div>`,
            });

            // 마커 클릭 시 인포윈도우 표시
            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(map, marker);
            });

            // 지도 로드 완료 후 에러 상태 초기화
            setMapError(null);
          } else {
            // 주소 검색 실패 시
            console.error(
              "주소를 찾을 수 없습니다:",
              propertyInfo.location.address
            );
            setMapError("주소를 찾을 수 없습니다.");
          }
        }
      );
    } catch (err) {
      console.error("지도 초기화 중 오류 발생:", err);
      setMapError("지도를 불러오는 중 오류가 발생했습니다.");
    }
  }, [propertyInfo?.location?.address]);

  // 카카오맵 스크립트 로드 및 지도 초기화
  useEffect(() => {
    // 매물 정보가 없거나 주소가 없으면 지도 초기화하지 않음
    if (!propertyInfo?.location?.address) return;

    // 카카오맵 API 키 확인
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    if (!apiKey) {
      console.error("카카오맵 API 키가 설정되지 않았습니다.");
      setMapError("카카오맵 API 키가 설정되지 않았습니다.");
      return;
    }

    // 이미 스크립트가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // 이미 스크립트 태그가 DOM에 있는지 확인 (중복 로드 방지)
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
    );

    if (existingScript) {
      // 스크립트가 이미 있으면 로드 완료를 기다림
      const checkKakaoLoaded = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakaoLoaded);
          window.kakao.maps.load(() => {
            setMapLoaded(true);
            initializeMap();
          });
        }
      }, 100);

      // 최대 10초 대기 후 타임아웃
      setTimeout(() => {
        clearInterval(checkKakaoLoaded);
        if (!window.kakao || !window.kakao.maps) {
          console.error("카카오맵 스크립트 로드 타임아웃");
          setMapError("지도를 불러오는데 시간이 너무 오래 걸립니다.");
        }
      }, 10000);

      return () => {
        clearInterval(checkKakaoLoaded);
      };
    }

    // 카카오맵 스크립트 동적 로드
    const script = document.createElement("script");
    // HTTPS 프로토콜 명시 (로컬 개발 환경에서도 안정적으로 작동)
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // 스크립트 로드 후 카카오맵 초기화
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setMapLoaded(true);
          initializeMap();
        });
      } else {
        console.error("카카오맵 객체를 찾을 수 없습니다.");
        setMapError("지도를 초기화하는데 실패했습니다.");
      }
    };

    script.onerror = (error) => {
      console.error("카카오맵 스크립트를 로드하는데 실패했습니다:", error);
      console.error("스크립트 URL:", script.src);
      console.error("API 키 존재 여부:", !!apiKey);
      setMapError(
        "지도를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요."
      );
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 정리 작업
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [propertyInfo?.location?.address, initializeMap]);

  // 로딩 중일 때
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

  // 에러가 있거나 매물 정보가 없을 때
  if (error || !property || !propertyInfo) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "매물을 찾을 수 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 왼쪽 컬럼: 부동산 상세 정보 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 네비게이션 탭 */}
          <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border pt-4 pb-2 bg-background pt-2">
            {/* 매물번호 태그 */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md bg-card">
              <MapPin className="w-4 h-4 text-foreground" />
              <span className="text-sm text-foreground">매물번호</span>
              <span className="text-sm font-semibold text-primary">
                {propertyInfo.details.propertyNumber}
              </span>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleTabClick("info")}
                className={`text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "info"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                매물 정보
              </button>
              <button
                onClick={() => handleTabClick("description")}
                className={`text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "description"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                매물 설명
              </button>
              <button
                onClick={() => handleTabClick("location")}
                className={`text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "location"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                위치 및 주변시설
              </button>
              <button
                onClick={() => handleTabClick("others")}
                className={`text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "others"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                다른 매물
              </button>
            </div>
          </div>

          {/* 이미지 갤러리 */}
          <div className="space-y-4">
            {/* 메인 이미지 */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <Image
                src={propertyImages[currentImageIndex] || "/search/1.jpg"}
                alt={propertyInfo.title}
                fill
                className="object-cover"
                priority
              />
              {/* 좌우 화살표 버튼 */}
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft className="w-6 h-6 text-foreground" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                    aria-label="다음 이미지"
                  >
                    <ChevronRight className="w-6 h-6 text-foreground" />
                  </button>
                </>
              )}
            </div>

            {/* 썸네일 이미지들 */}
            {propertyImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {propertyImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`이미지 ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`부동산 이미지 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 부동산 헤더 정보 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {propertyInfo.title}
                </h1>
                {propertyInfo.subtitle && (
                  <p className="text-lg text-muted-foreground mb-4">
                    {propertyInfo.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-2xl font-bold text-primary">
                    {propertyInfo.price}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {propertyInfo.specs.area && (
                      <>
                        <span>{propertyInfo.specs.area}</span>
                        <span>|</span>
                      </>
                    )}
                    {propertyInfo.specs.rooms && (
                      <>
                        <span>{propertyInfo.specs.rooms}</span>
                        <span>|</span>
                      </>
                    )}
                    {propertyInfo.specs.floor && (
                      <>
                        <span>{propertyInfo.specs.floor}</span>
                        <span>|</span>
                      </>
                    )}
                    {propertyInfo.specs.direction && (
                      <span>{propertyInfo.specs.direction}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="알림 설정"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="즐겨찾기"
                >
                  <Star className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* 매물 정보 섹션 */}
          <div id="info" className="scroll-mt-24">
            {/* 부동산 상세 정보 테이블 */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="divide-y divide-border">
                {/* 첫 번째 행: 공급면적 | 해당층/총층 */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      공급면적
                    </span>
                  </div>
                  <div className="px-4 py-3 border-r border-border">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.supplyArea || "-"}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      해당층/총층
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.floorInfo || "-"}
                    </span>
                  </div>
                </div>
                {/* 두 번째 행: 방/욕실 | 입주가능일 */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      방/욕실
                    </span>
                  </div>
                  <div className="px-4 py-3 border-r border-border">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.roomsBaths || "-"}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      입주가능일
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.moveInDate || "-"}
                    </span>
                  </div>
                </div>
                {/* 세 번째 행: 방향 | 현관구조 */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">방향</span>
                  </div>
                  <div className="px-4 py-3 border-r border-border">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.direction || "-"}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      현관구조
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.entranceStructure || "-"}
                    </span>
                  </div>
                </div>
                {/* 네 번째 행: 기본옵션정보 | 관리비 */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      기본옵션정보
                    </span>
                  </div>
                  <div className="px-4 py-3 border-r border-border">
                    {propertyInfo.details.basicOptions && (
                      <span className="text-sm text-primary font-semibold">
                        V
                      </span>
                    )}
                    {!propertyInfo.details.basicOptions && (
                      <span className="text-sm text-foreground">-</span>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      관리비
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">
                        {propertyInfo.details.maintenanceFee || "-"}
                      </span>
                      {propertyInfo.details.maintenanceFee && (
                        <a
                          href="#"
                          className="text-xs text-primary hover:underline"
                        >
                          자세히보기
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {/* 다섯 번째 행: 난방방식 | 사용승인일 */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      난방방식
                    </span>
                  </div>
                  <div className="px-4 py-3 border-r border-border">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.heatingMethod || "-"}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      사용승인일
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.approvalDate || "-"}
                    </span>
                  </div>
                </div>
                {/* 여섯 번째 행: 총세대수 | 총주차대수 */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      총세대수
                    </span>
                  </div>
                  <div className="px-4 py-3 border-r border-border">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.totalHouseholds || "-"}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      총주차대수
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.totalParking || "-"}
                    </span>
                  </div>
                </div>
                {/* 일곱 번째 행: 건설사 | 물건번호 */}
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      건설사
                    </span>
                  </div>
                  <div className="px-4 py-3 border-r border-border">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.constructor || "-"}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      물건번호
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.propertyNumber || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 매물 설명 섹션 */}
          <div id="description" className="scroll-mt-24">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                매물 설명
              </h3>
              <div className="space-y-4">
                {propertyInfo.description.map(
                  (paragraph: string, index: number) => (
                    <p
                      key={index}
                      className="text-sm text-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* 위치 및 주변시설 섹션 */}
          <div id="location" className="scroll-mt-24">
            {/* 위치 지도 섹션 */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="relative aspect-video w-full bg-muted">
                {/* 카카오맵 컨테이너 */}
                <div
                  ref={mapContainerRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ minHeight: "400px" }}
                >
                  {/* 로딩 중 또는 에러 상태 표시 */}
                  {(!mapLoaded || mapError) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 z-10">
                      <div className="text-center">
                        {mapError ? (
                          <>
                            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">
                              {mapError}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {propertyInfo.location.address}
                            </p>
                            {propertyInfo.location.mapUrl !== "#" && (
                              <a
                                href={propertyInfo.location.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
                              >
                                크게보기
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">
                              지도를 불러오는 중...
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 주변시설 정보 */}
            {property.facilities &&
              Object.keys(property.facilities).length > 0 && (
                <div className="border border-border rounded-lg p-6 bg-card mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    주변시설
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(property.facilities).map(
                      ([category, items]: [string, any]) => (
                        <div key={category}>
                          <h4 className="text-sm font-semibold text-foreground mb-2">
                            {category}
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {Array.isArray(items) &&
                              items.map((item: string, index: number) => (
                                <li key={index}>• {item}</li>
                              ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* 재무 정보 섹션 */}
          {propertyInfo.financial && (
            <div className="space-y-4">
              {/* 세금 정보 */}
              {propertyInfo.financial.acquisitionTax && (
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    세금정보
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        취득세
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {propertyInfo.financial.acquisitionTax}
                        </span>
                        {propertyInfo.financial.acquisitionTaxNote && (
                          <span className="text-xs text-muted-foreground">
                            ({propertyInfo.financial.acquisitionTaxNote})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 중개보수 정보 */}
              {(propertyInfo.financial.brokerageFeeSale ||
                propertyInfo.financial.brokerageFeeRent) && (
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    중개보수
                  </h3>
                  <div className="space-y-3">
                    {propertyInfo.financial.brokerageFeeSale && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          매매시
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {propertyInfo.financial.brokerageFeeSale}
                          </span>
                          {propertyInfo.financial.brokerageFeeNote && (
                            <span className="text-xs text-muted-foreground">
                              ({propertyInfo.financial.brokerageFeeNote})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {propertyInfo.financial.brokerageFeeRent && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          전월세시
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {propertyInfo.financial.brokerageFeeRent}
                          </span>
                          {propertyInfo.financial.brokerageFeeNote && (
                            <span className="text-xs text-muted-foreground">
                              ({propertyInfo.financial.brokerageFeeNote})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {propertyInfo.financial.disclaimer && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      {propertyInfo.financial.disclaimer}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 다른 매물 섹션 */}
          <div id="others" className="scroll-mt-24">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                다른 매물
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  다른 매물 정보를 불러오는 중...
                </p>
                {/* TODO: 다른 매물 목록을 가져와서 표시 */}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼: 에이전트 정보 및 문의 폼 */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-10.5 pt-4 lg:self-start">
          {/* 작성자 정보 카드 */}
          <div className="bg-primary text-primary-foreground rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                <Image
                  src={creatorInfo.image}
                  alt={creatorInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{creatorInfo.name}</h3>
                {creatorInfo.companyName && (
                  <p className="text-primary-foreground/80 text-sm">
                    {creatorInfo.companyName}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {creatorInfo.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a
                    href={`tel:${creatorInfo.phone}`}
                    className="hover:underline"
                  >
                    {creatorInfo.phone}
                  </a>
                </p>
              )}
              {creatorInfo.email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${creatorInfo.email}`}
                    className="hover:underline break-all"
                  >
                    {creatorInfo.email}
                  </a>
                </p>
              )}
              {!creatorInfo.phone && !creatorInfo.email && (
                <p className="text-primary-foreground/60 text-xs">
                  연락처 정보가 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* 문의 폼 */}
          <div className="border border-border rounded-lg p-4 bg-card">
            <h2 className="text-xl font-semibold px-2 mb-4 text-primary">
              매물 문의하기
            </h2>
            <form className="space-y-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-light px-2 mb-1 text-foreground"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-xs"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div className="flex items-center gap-2 px-1 py-1">
                <input
                  type="checkbox"
                  id="visit"
                  name="visit"
                  className="border-input rounded-md bg-background text-foreground "
                />
                <label
                  htmlFor="visit"
                  className=" text-xs font-light text-foreground"
                >
                  임장신청하기
                </label>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className=" text-xs font-light px-2 mb-1 block text-foreground"
                >
                  전화번호
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-xs"
                  placeholder="전화번호를 입력하세요"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-light px-2 mb-1 text-foreground"
                >
                  메시지
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full px-2 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder:text-xs"
                  placeholder="메시지를 입력하세요"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
              >
                문의하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
