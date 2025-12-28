-- profiles 테이블에 is_admin 필드 추가
-- 관리자 권한을 관리하는 필드

-- is_admin 필드 추가 (기본값은 false)
alter table public.profiles
add column is_admin boolean default false not null;

-- is_admin 필드에 인덱스 생성 (성능 최적화)
create index if not exists profiles_is_admin_idx 
on public.profiles(is_admin) 
where is_admin = true;

-- 기존 사용자는 모두 일반 사용자로 설정 (is_admin = false)
-- 관리자로 설정하려면 수동으로 업데이트 필요
-- 예시: update public.profiles set is_admin = true where email = 'admin@example.com';

