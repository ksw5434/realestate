-- profiles 테이블 생성
-- 사용자 프로필 및 회사 정보를 저장하는 테이블
-- id는 auth.users를 참조하며, 나머지 필드는 모두 선택사항입니다.

create table public.profiles (
  -- 기본 키: auth.users의 id를 참조
  id uuid references auth.users on delete cascade primary key,
  
  -- 프로필 정보 (선택사항)
  name text,
  phone text,
  profile_image text,
  
  -- 회사 정보 (선택사항)
  company_name text,
  business_number text,
  representative text,
  company_phone text,
  company_email text,
  address text,
  website text,
  
  -- 타임스탬프
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) 활성화
alter table public.profiles enable row level security;

-- 사용자는 자신의 프로필만 조회 가능
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 사용자는 자신의 프로필만 생성 가능
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- updated_at 자동 업데이트를 위한 함수 생성
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- updated_at 트리거 생성
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- 사용자 생성 시 자동으로 프로필 레코드 생성하는 함수
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- 사용자 생성 시 프로필 자동 생성 트리거
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 인덱스 생성 (성능 최적화)
create index if not exists profiles_email_idx on public.profiles(company_email) where company_email is not null;
create index if not exists profiles_phone_idx on public.profiles(phone) where phone is not null;

