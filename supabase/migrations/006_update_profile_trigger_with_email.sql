-- 프로필 자동 생성 트리거 수정
-- 사용자 생성 시 이메일도 함께 프로필에 저장하도록 수정

-- 기존 트리거 함수 삭제 후 재생성
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 사용자 생성 시 자동으로 프로필 레코드 생성하는 함수 (이메일 포함)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- 사용자 생성 시 프로필 자동 생성 트리거
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

