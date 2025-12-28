-- properties 테이블 생성
-- 부동산 매물 정보를 저장하는 테이블

create table public.properties (
  -- 기본 키
  id uuid default gen_random_uuid() primary key,
  
  -- 매물 기본 정보
  property_number text not null unique, -- 물건번호 (매물번호)
  title text not null, -- 제목 (예: "반포자이 106동")
  subtitle text, -- 부제목 (예: "24평으로 방3개 화장실2개 입주가능")
  price text not null, -- 가격 (예: "매매 26억 6,000만원")
  
  -- 스펙 정보
  area text, -- 면적 (예: "84.72 | 109.88m²")
  rooms text, -- 방 정보 (예: "방3개, 욕실2개")
  floor text, -- 층 정보 (예: "고층/35층")
  direction text, -- 방향 (예: "남향")
  
  -- 상세 정보
  supply_area text, -- 공급면적 (예: "84.72 | 109.88m²")
  floor_info text, -- 해당층/총층 (예: "고층/35층")
  rooms_baths text, -- 방/욕실 (예: "방3개, 욕실2개")
  move_in_date text, -- 입주가능일 (예: "즉시입주 (협의가능)")
  entrance_structure text, -- 현관구조
  has_basic_options boolean default false, -- 기본옵션정보 유무
  maintenance_fee text, -- 관리비 (예: "월 260,000원")
  heating_method text, -- 난방방식 (예: "개별난방")
  approval_date text, -- 사용승인일 (예: "2009년 10월 24일")
  total_households text, -- 총세대수 (예: "2444세대")
  total_parking text, -- 총주차대수 (예: "79p")
  constructor text, -- 건설사 (예: "GS건설")
  
  -- 매물 설명 (배열로 저장)
  descriptions text[], -- 매물 설명 배열
  
  -- 위치 정보
  address text not null, -- 주소 (예: "서울특별시 서초구 반포동")
  map_url text, -- 지도 URL
  
  -- 주변시설 정보 (JSONB로 저장)
  facilities jsonb, -- 주변시설 정보 (교육시설, 쇼핑/편의시설, 의료시설, 교통)
  -- 예시 구조:
  -- {
  --   "education": ["반포초등학교 (도보 5분)", "반포중학교 (도보 7분)"],
  --   "shopping": ["신세계백화점 (차량 5분)", "뉴코아아울렛 (차량 7분)"],
  --   "medical": ["강남성모병원 (차량 10분)", "세브란스병원 (차량 15분)"],
  --   "transportation": ["지하철 3호선 고속터미널역 (도보 8분)"]
  -- }
  
  -- 재무 정보 (JSONB로 저장)
  financial_info jsonb, -- 재무 정보
  -- 예시 구조:
  -- {
  --   "acquisition_tax": "8,504만원",
  --   "acquisition_tax_note": "부가세 별도",
  --   "brokerage_fee_sale": "2,394만원",
  --   "brokerage_fee_rent": "1,280만원",
  --   "brokerage_fee_note": "부가세 별도",
  --   "disclaimer": "*중개보수 및 세금정보는 실제와 상이할 수 있습니다."
  -- }
  
  -- 연락처 정보
  contact_office text, -- 중개사무소명
  contact_tel text, -- 전화번호
  contact_mobile text, -- 휴대폰번호
  
  -- 등록자 정보 (profiles 테이블 참조)
  created_by uuid references public.profiles(id) on delete set null,
  
  -- 타임스탬프
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- property_images 테이블 생성
-- 부동산 매물 이미지를 저장하는 테이블 (1:N 관계)
create table public.property_images (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  image_url text not null, -- 이미지 URL 또는 경로
  image_order integer default 0, -- 이미지 순서
  is_main boolean default false, -- 메인 이미지 여부
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) 활성화
alter table public.properties enable row level security;
alter table public.property_images enable row level security;

-- properties 테이블 정책
-- 모든 사용자가 매물 조회 가능
create policy "Anyone can view properties"
  on public.properties for select
  using (true);

-- 인증된 사용자만 매물 생성 가능
create policy "Authenticated users can create properties"
  on public.properties for insert
  with check (auth.role() = 'authenticated');

-- 매물 생성자만 수정 가능
create policy "Users can update own properties"
  on public.properties for update
  using (auth.uid() = created_by);

-- 매물 생성자만 삭제 가능
create policy "Users can delete own properties"
  on public.properties for delete
  using (auth.uid() = created_by);

-- property_images 테이블 정책
-- 모든 사용자가 이미지 조회 가능
create policy "Anyone can view property images"
  on public.property_images for select
  using (true);

-- 인증된 사용자만 이미지 생성 가능
create policy "Authenticated users can create property images"
  on public.property_images for insert
  with check (auth.role() = 'authenticated');

-- 이미지 소유자만 수정/삭제 가능
create policy "Users can manage own property images"
  on public.property_images for all
  using (
    exists (
      select 1 from public.properties
      where properties.id = property_images.property_id
      and properties.created_by = auth.uid()
    )
  );

-- updated_at 자동 업데이트를 위한 트리거 (properties 테이블)
create trigger set_properties_updated_at
  before update on public.properties
  for each row
  execute function public.handle_updated_at();

-- 인덱스 생성 (성능 최적화)
create index if not exists properties_property_number_idx on public.properties(property_number);
create index if not exists properties_created_by_idx on public.properties(created_by);
create index if not exists properties_address_idx on public.properties(address);
create index if not exists properties_created_at_idx on public.properties(created_at desc);
create index if not exists property_images_property_id_idx on public.property_images(property_id);
create index if not exists property_images_order_idx on public.property_images(property_id, image_order);

-- JSONB 필드에 대한 GIN 인덱스 (검색 성능 향상)
create index if not exists properties_facilities_idx on public.properties using gin(facilities);
create index if not exists properties_financial_info_idx on public.properties using gin(financial_info);

