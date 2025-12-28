-- properties 테이블 RLS 정책 수정
-- 관리자만 매물을 생성/수정/삭제할 수 있도록 변경

-- 기존 정책 삭제
drop policy if exists "Authenticated users can create properties" on public.properties;
drop policy if exists "Users can update own properties" on public.properties;
drop policy if exists "Users can delete own properties" on public.properties;
drop policy if exists "Authenticated users can create property images" on public.property_images;
drop policy if exists "Users can manage own property images" on public.property_images;

-- 관리자만 매물 생성 가능
create policy "Only admins can create properties"
  on public.properties for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- 관리자만 매물 수정 가능
create policy "Only admins can update properties"
  on public.properties for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- 관리자만 매물 삭제 가능
create policy "Only admins can delete properties"
  on public.properties for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- 관리자만 이미지 생성 가능
create policy "Only admins can create property images"
  on public.property_images for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- 관리자만 이미지 수정/삭제 가능
create policy "Only admins can manage property images"
  on public.property_images for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

