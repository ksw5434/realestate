# Profiles 테이블 설정 가이드

이 문서는 Supabase에서 `profiles` 테이블을 생성하고 설정하는 방법을 설명합니다.

## 테이블 구조

`profiles` 테이블은 사용자 프로필 정보와 회사 정보를 저장합니다.

### 필드 설명

#### 기본 필드

- `id` (uuid, PK): `auth.users` 테이블의 `id`를 참조하는 외래 키 (필수)
- `created_at` (timestamp): 레코드 생성 시간 (자동 생성)
- `updated_at` (timestamp): 레코드 수정 시간 (자동 업데이트)

#### 프로필 정보 (모두 선택사항)

- `name` (text): 사용자 이름
- `phone` (text): 사용자 전화번호
- `profile_image` (text): 프로필 이미지 URL

#### 회사 정보 (모두 선택사항)

- `company_name` (text): 회사명
- `business_number` (text): 사업자등록번호
- `representative` (text): 대표자명
- `company_phone` (text): 회사 전화번호
- `company_email` (text): 회사 이메일
- `address` (text): 회사 주소
- `website` (text): 회사 웹사이트 URL

## 설정 방법

### 방법 1: Supabase 대시보드에서 직접 실행

1. Supabase 대시보드에 로그인합니다.
2. **SQL Editor**로 이동합니다.
3. `supabase/migrations/001_create_profiles_table.sql` 파일의 내용을 복사하여 실행합니다.

### 방법 2: Supabase CLI 사용 (권장)

```bash
# Supabase CLI가 설치되어 있다면
supabase db push
```

## 주요 기능

### 1. Row Level Security (RLS)

- 사용자는 자신의 프로필만 조회, 수정, 생성할 수 있습니다.
- 다른 사용자의 프로필 정보에 접근할 수 없습니다.

### 2. 자동 프로필 생성

- `auth.users` 테이블에 새 사용자가 생성되면 자동으로 `profiles` 테이블에 레코드가 생성됩니다.
- 초기에는 `id`만 설정되고 나머지 필드는 `NULL`입니다.

### 3. 자동 타임스탬프 업데이트

- `updated_at` 필드는 레코드가 수정될 때마다 자동으로 업데이트됩니다.

### 4. 인덱스

- `company_email`과 `phone` 필드에 인덱스가 생성되어 검색 성능이 향상됩니다.

## 사용 예시

### 프로필 조회

```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data: profile, error } = await supabase
  .from("profiles")
  .select("*")
  .single();
```

### 프로필 업데이트

```typescript
const { data, error } = await supabase
  .from("profiles")
  .update({
    name: "김수환",
    phone: "010-6579-2424",
    company_name: "힐스테이트 황금엘포레 부동산",
    business_number: "123-45-67890",
    // ... 기타 필드
  })
  .eq("id", userId);
```

### 프로필 생성 (일반적으로 자동 생성되지만 수동으로도 가능)

```typescript
const { data, error } = await supabase.from("profiles").insert({
  id: userId,
  name: "김수환",
  // ... 기타 필드
});
```

## 주의사항

1. **이메일 필드**: `email`은 `auth.users` 테이블에 저장되므로 `profiles` 테이블에는 `company_email`만 저장합니다.

2. **NULL 값**: 모든 필드가 선택사항이므로 `NULL` 값을 허용합니다. 애플리케이션에서 적절히 처리해야 합니다.

3. **프로필 이미지**: `profile_image` 필드는 이미지 파일의 URL을 저장합니다. 실제 이미지 파일은 Supabase Storage에 업로드하거나 외부 CDN을 사용할 수 있습니다.

4. **데이터 검증**: 애플리케이션 레벨에서 필드 유효성 검사를 수행해야 합니다. (예: 이메일 형식, 전화번호 형식 등)

## 문제 해결

### 프로필이 자동 생성되지 않는 경우

- 트리거 함수가 제대로 생성되었는지 확인하세요.
- Supabase 대시보드에서 **Database** > **Functions**에서 `handle_new_user` 함수가 있는지 확인하세요.

### RLS 정책이 작동하지 않는 경우

- RLS가 활성화되어 있는지 확인하세요: `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`
- 정책이 올바르게 생성되었는지 확인하세요: **Database** > **Policies**에서 확인

### 기존 사용자에 대한 프로필 생성

기존 사용자들이 있다면 다음 SQL을 실행하여 프로필을 생성할 수 있습니다:

```sql
-- 기존 사용자들의 프로필 생성
insert into public.profiles (id)
select id from auth.users
where id not in (select id from public.profiles);
```
