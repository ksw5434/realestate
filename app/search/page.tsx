"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function Search() {
  // 이미지 갤러리 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 샘플 이미지 URL들 (실제로는 props나 API에서 받아올 데이터)
  const propertyImages = [
    "/search/1.jpg", // 메인 이미지 (실제로는 부동산 이미지 URL)
    "/search/2.jpg",
    "/search/3.jpg",
    "/search/4.jpg",
    "/search/5.jpg",
    "/search/6.jpg",
  ];

  // 부동산 정보
  const propertyInfo = {
    title: "Luxury Modern Home in Pacific Palisades",
    price: "$4,500,000",
    address: "1234 Ocean View Drive, Pacific Palisades, CA 90272",
    description:
      "This stunning 4-bedroom, 4.5-bathroom contemporary residence offers breathtaking ocean views, an open floor plan, gourmet kitchen, private pool, and smart home technology. Perfect for indoor-outdoor living.",
    stats: {
      beds: 4,
      baths: 4.5,
      sqft: "3,800",
      lotSize: "0.25 Acre",
      yearBuilt: 2022,
      garage: "2-Car",
    },
    amenities: [
      "Swimming Pool",
      "Spa",
      "Ocean View",
      "Gourmet Kitchen",
      "Smart Home System",
      "Home Theater",
      "Wine Cellar",
      "Private Patio",
      "High Ceilings",
      "Hardwood Floors",
    ],
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
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 컬럼: 부동산 상세 정보 */}
        <div className="lg:col-span-2 space-y-8">
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

          {/* 부동산 제목 및 가격 */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {propertyInfo.title}
              </h1>
              <p className="text-muted-foreground">{propertyInfo.address}</p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {propertyInfo.price}
            </div>
          </div>

          {/* 부동산 설명 */}
          <p className="text-foreground leading-relaxed">
            {propertyInfo.description}
          </p>

          {/* 주요 통계 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-y border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bed className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">침실</p>
                <p className="font-semibold">{propertyInfo.stats.beds} Beds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bath className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">욕실</p>
                <p className="font-semibold">
                  {propertyInfo.stats.baths} Baths
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Square className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">면적</p>
                <p className="font-semibold">{propertyInfo.stats.sqft} Sq Ft</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Square className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">부지 크기</p>
                <p className="font-semibold">
                  {propertyInfo.stats.lotSize} Lot
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">건축 연도</p>
                <p className="font-semibold">
                  Year Built: {propertyInfo.stats.yearBuilt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">주차</p>
                <p className="font-semibold">
                  Garage: {propertyInfo.stats.garage}
                </p>
              </div>
            </div>
          </div>

          {/* 편의시설 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">편의시설</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {propertyInfo.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="text-primary">{getAmenityIcon(amenity)}</div>
                  <span className="text-foreground">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼: 에이전트 정보 및 문의 폼 */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 lg:self-start">
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
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">전화:</span>{" "}
                <a href={`tel:${agentInfo.phone}`} className="hover:underline">
                  {agentInfo.phone}
                </a>
              </p>
              <p>
                <span className="font-semibold">이메일:</span>{" "}
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
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-bold mb-4">매물 문의하기</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  전화번호
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="전화번호를 입력하세요"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  메시지
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="메시지를 입력하세요"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
              >
                요청 보내기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
