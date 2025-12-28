-- properties 테이블에 작성자 정보 자동 입력 트리거
-- INSERT 시 created_by 필드를 현재 로그인한 사용자로 자동 설정

-- 트리거 함수 생성
-- properties 테이블에 데이터가 INSERT될 때 created_by가 설정되지 않았으면
-- 현재 로그인한 사용자(auth.uid())를 자동으로 설정
create or replace function public.auto_set_property_creator()
returns trigger as $$
begin
  -- created_by가 명시적으로 설정되지 않은 경우에만 자동 설정
  if new.created_by is null then
    -- 현재 로그인한 사용자의 ID를 created_by에 설정
    new.created_by := auth.uid();
    
    -- 프로필이 없으면 자동 생성 (선택사항)
    -- 이미 프로필 생성 트리거가 있으므로 주석 처리
    -- insert into public.profiles (id)
    -- values (auth.uid())
    -- on conflict (id) do nothing;
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- 트리거 생성
-- properties 테이블에 INSERT 전에 실행
create trigger set_property_creator_before_insert
  before insert on public.properties
  for each row
  execute function public.auto_set_property_creator();

-- 트리거가 제대로 작동하는지 확인하는 주석
-- 참고: 이 트리거는 created_by가 null인 경우에만 작동합니다.
-- 애플리케이션 코드에서 명시적으로 created_by를 설정하면 그 값을 사용합니다.
-- 트리거는 보안상의 이유로 security definer로 실행되므로,
-- RLS(Row Level Security) 정책과 함께 사용해야 합니다.

