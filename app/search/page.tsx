"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Bed,
  Bath,
  Square,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Waves,
  Sparkles,
  Mountain,
  ChefHat,
  Home,
  Film,
  Wine,
  Sun,
  Gauge,
  HardDrive,
  Phone,
  Mail,
  Bell,
  Star,
  MapPin,
  Building,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function Search() {
  // 이미지 갤러리 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 네비게이션 탭 상태 관리
  const [activeTab, setActiveTab] = useState("info");
  // 스크롤 중인지 추적 (프로그래밍 방식 스크롤 중에는 탭 업데이트 방지)
  const isScrollingRef = useRef(false);

  // 샘플 이미지 URL들 (실제로는 props나 API에서 받아올 데이터)
  const propertyImages = [
    "/search/1.jpg", // 메인 이미지 (실제로는 부동산 이미지 URL)
    "/search/2.jpg",
    "/search/3.jpg",
    "/search/4.jpg",
    "/search/5.jpg",
    "/search/6.jpg",
  ];

  // 부동산 정보 (이미지 참조 데이터)
  const propertyInfo = {
    title: "반포자이 106동",
    subtitle: "24평으로 방3개 화장실2개 입주가능",
    price: "매매 26억 6,000만원",
    specs: {
      area: "84.72 | 109.88m²",
      rooms: "방3개, 욕실2개",
      floor: "고층/35층",
      direction: "남향",
    },
    details: {
      supplyArea: "84.72 | 109.88m²",
      floorInfo: "고층/35층",
      roomsBaths: "방3개, 욕실2개",
      moveInDate: "즉시입주 (협의가능)",
      direction: "남향(거실기준)",
      entranceStructure: "",
      basicOptions: true,
      maintenanceFee: "월 260,000원",
      heatingMethod: "개별난방",
      approvalDate: "2009년 10월 24일",
      totalHouseholds: "2444세대",
      totalParking: "79p",
      constructor: "GS건설",
      propertyNumber: "328807600",
    },
    description: [
      "반포자이 전문중개사무소에서 소개하는 이 매물은 깔끔하게 정리된 상태로 즉시 입주가 가능합니다.",
      "2024년 1월 기준 반포자이 최근 실거래가: 20억 6,000만원, 20억 4,000만원, 20억 8,000만원, 21억 4,000만원, 22억 6,000만원 등이 거래되었습니다.",
      "인근에 반포초등학교, 반포중학교, 반포고등학교가 위치하여 명문 학군으로 유명합니다.",
      "교통 및 생활편의: 신세계백화점, 뉴코아아울렛, 강남성모병원, 국립중앙도서관 등이 인접해 있어 생활이 편리합니다.",
      "반포자이 전문중개사무소는 실사진을 사용합니다.",
      "문의사항이 있으시면 언제든지 연락주시기 바랍니다.",
    ],
    contact: {
      office: "반포자이 전문중개사무소",
      tel: "02)595-8880",
      mobile: "010-6579-2424",
    },
    financial: {
      acquisitionTax: "8,504만원",
      acquisitionTaxNote: "부가세 별도",
      brokerageFeeSale: "2,394만원",
      brokerageFeeRent: "1,280만원",
      brokerageFeeNote: "부가세 별도",
      disclaimer: "*중개보수 및 세금정보는 실제와 상이할 수 있습니다.",
    },
    location: {
      address: "서울특별시 서초구 반포동",
      mapUrl: "#", // 실제 지도 URL로 교체 필요
    },
  };

  // 에이전트 정보
  const agentInfo = {
    name: "김수환",
    title: "힐스테이트 황금엘포레 부동산",
    phone: "(053) 792-7777",
    email: "suhwan0219@gmail.com",
    image: "/search/profile.jpg", // 실제로는 에이전트 프로필 이미지 URL
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
            ["info", "description", "land", "location", "others"].includes(
              sectionId
            )
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
    const sections = ["info", "description", "land", "location", "others"];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // 편의시설 아이콘 매핑
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "Swimming Pool": <Waves className="w-5 h-5" />,
      Spa: <Sparkles className="w-5 h-5" />,
      "Ocean View": <Mountain className="w-5 h-5" />,
      "Gourmet Kitchen": <ChefHat className="w-5 h-5" />,
      "Smart Home System": <Home className="w-5 h-5" />,
      "Home Theater": <Film className="w-5 h-5" />,
      "Wine Cellar": <Wine className="w-5 h-5" />,
      "Private Patio": <Sun className="w-5 h-5" />,
      "High Ceilings": <Gauge className="w-5 h-5" />,
      "Hardwood Floors": <HardDrive className="w-5 h-5" />,
    };
    return iconMap[amenity] || <Home className="w-5 h-5" />;
  };

  return (
    <div className="container py-2">
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
                onClick={() => handleTabClick("land")}
                className={`text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "land"
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                토지 정보
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
                src={propertyImages[currentImageIndex]}
                alt={propertyInfo.title}
                fill
                className="object-cover"
                priority
              />
              {/* 좌우 화살표 버튼 */}
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
            </div>

            {/* 썸네일 이미지들 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {propertyImages.map((image, index) => (
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
          </div>

          {/* 부동산 헤더 정보 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {propertyInfo.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {propertyInfo.subtitle}
                </p>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-2xl font-bold text-primary">
                    {propertyInfo.price}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{propertyInfo.specs.area}</span>
                    <span>|</span>
                    <span>{propertyInfo.specs.rooms}</span>
                    <span>|</span>
                    <span>{propertyInfo.specs.floor}</span>
                    <span>|</span>
                    <span>{propertyInfo.specs.direction}</span>
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
                      {propertyInfo.details.supplyArea}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      해당층/총층
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.floorInfo}
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
                      {propertyInfo.details.roomsBaths}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      입주가능일
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.moveInDate}
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
                      {propertyInfo.details.direction}
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
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      관리비
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">
                        {propertyInfo.details.maintenanceFee}
                      </span>
                      <a
                        href="#"
                        className="text-xs text-primary hover:underline"
                      >
                        자세히보기
                      </a>
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
                      {propertyInfo.details.heatingMethod}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      사용승인일
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.approvalDate}
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
                      {propertyInfo.details.totalHouseholds}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      총주차대수
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.totalParking}
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
                      {propertyInfo.details.constructor}
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-muted/50 border-r border-border">
                    <span className="text-sm text-muted-foreground">
                      물건번호
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {propertyInfo.details.propertyNumber}
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
                {propertyInfo.description.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm text-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* 토지 정보 섹션 */}
          <div id="land" className="scroll-mt-24">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                토지 정보
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">지목</span>
                    <p className="text-sm text-foreground mt-1">대지</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">면적</span>
                    <p className="text-sm text-foreground mt-1">
                      {propertyInfo.details.supplyArea}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      용도지역
                    </span>
                    <p className="text-sm text-foreground mt-1">
                      제1종 일반주거지역
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      건폐율
                    </span>
                    <p className="text-sm text-foreground mt-1">60%</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      용적률
                    </span>
                    <p className="text-sm text-foreground mt-1">200%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 위치 및 주변시설 섹션 */}
          <div id="location" className="scroll-mt-24">
            {/* 위치 지도 섹션 */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="relative aspect-video w-full bg-muted">
                {/* 지도 플레이스홀더 - 실제로는 Google Maps나 Kakao Map API를 사용 */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {propertyInfo.location.address}
                    </p>
                    <a
                      href={propertyInfo.location.mapUrl}
                      className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
                    >
                      크게보기
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 주변시설 정보 */}
            <div className="border border-border rounded-lg p-6 bg-card mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                주변시설
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    교육시설
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 반포초등학교 (도보 5분)</li>
                    <li>• 반포중학교 (도보 7분)</li>
                    <li>• 반포고등학교 (도보 10분)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    쇼핑/편의시설
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 신세계백화점 (차량 5분)</li>
                    <li>• 뉴코아아울렛 (차량 7분)</li>
                    <li>• 이마트 (도보 10분)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    의료시설
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 강남성모병원 (차량 10분)</li>
                    <li>• 세브란스병원 (차량 15분)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    교통
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 지하철 3호선 고속터미널역 (도보 8분)</li>
                    <li>• 지하철 7호선 고속터미널역 (도보 8분)</li>
                    <li>• 지하철 9호선 고속터미널역 (도보 8분)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 재무 정보 섹션 */}
          <div className="space-y-4">
            {/* 세금 정보 */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                세금정보
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">취득세</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {propertyInfo.financial.acquisitionTax}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({propertyInfo.financial.acquisitionTaxNote})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 중개보수 정보 */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                중개보수
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">매매시</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {propertyInfo.financial.brokerageFeeSale}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({propertyInfo.financial.brokerageFeeNote})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    전월세시
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {propertyInfo.financial.brokerageFeeRent}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({propertyInfo.financial.brokerageFeeNote})
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {propertyInfo.financial.disclaimer}
              </p>
            </div>
          </div>

          {/* 다른 매물 섹션 */}
          <div id="others" className="scroll-mt-24">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                다른 매물
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src="/search/1.jpg"
                      alt="다른 매물"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      반포자이 105동
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      28평형 | 방3개, 욕실2개
                    </p>
                    <p className="text-lg font-bold text-primary">
                      매매 28억 5,000만원
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src="/search/2.jpg"
                      alt="다른 매물"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      반포자이 107동
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      32평형 | 방4개, 욕실2개
                    </p>
                    <p className="text-lg font-bold text-primary">
                      매매 32억 2,000만원
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src="/search/3.jpg"
                      alt="다른 매물"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      반포자이 108동
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      24평형 | 방3개, 욕실2개
                    </p>
                    <p className="text-lg font-bold text-primary">
                      매매 25억 8,000만원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼: 에이전트 정보 및 문의 폼 */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-1 pt-4 lg:self-start">
          {/* 에이전트 정보 카드 */}
          <div className="bg-primary text-primary-foreground rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                <Image
                  src={agentInfo.image}
                  alt={agentInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{agentInfo.name}</h3>
                <p className="text-primary-foreground/80 text-sm">
                  {agentInfo.title}
                </p>
              </div>
            </div>
            <div className="space-y-0 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${agentInfo.phone}`} className="hover:underline">
                  {agentInfo.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${agentInfo.email}`}
                  className="hover:underline break-all"
                >
                  {agentInfo.email}
                </a>
              </p>
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
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-light px-2 mb-1 text-foreground"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-xs"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-light px-2 mb-1 text-foreground"
                >
                  전화번호
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none 
                  focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-xs"
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
                  rows={4}
                  className="w-full px-2 py-2 border border-input rounded-md bg-background 
                  text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                  resize-none placeholder:text-xs"
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
