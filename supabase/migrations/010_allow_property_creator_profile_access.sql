-- profiles 테이블 RLS 정책 추가
-- 매물의 작성자 정보는 누구나 조회할 수 있도록 허용
-- properties 테이블의 created_by를 통해 조인된 프로필 정보는 공개 정보로 간주

-- 매물 작성자 프로필 조회 허용 정책 추가
-- properties 테이블의 created_by 필드를 통해 참조되는 프로필은 누구나 조회 가능
create policy "Anyone can view property creator profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.properties
      where properties.created_by = profiles.id
    )
  );

