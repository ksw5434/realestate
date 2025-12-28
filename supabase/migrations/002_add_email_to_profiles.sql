-- profiles 테이블에 email 필드 추가
-- 사용자 이메일 주소를 저장하는 필드

-- email 필드 추가 (프로필 정보 섹션에 추가)
alter table public.profiles
add column email text;

-- email 필드에 인덱스 생성 (성능 최적화)
create index if not exists profiles_user_email_idx 
on public.profiles(email) 
where email is not null;

-- 기존 사용자의 email을 auth.users에서 가져와서 업데이트 (선택사항)
-- 이 부분은 필요에 따라 실행하세요
-- update public.profiles
-- set email = (
--   select email 
--   from auth.users 
--   where auth.users.id = profiles.id
-- )
-- where email is null;

