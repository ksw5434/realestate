-- profiles 테이블에 position 필드 추가
-- 직책 정보를 저장하는 필드 (선택사항)

-- position 필드 추가 (회사 정보 섹션에 추가)
alter table public.profiles
add column position text;

