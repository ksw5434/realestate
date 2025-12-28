# Supabase 연동 가이드

이 문서는 Next.js 프로젝트에 Supabase를 연동하는 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성합니다.
2. "New Project"를 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정합니다.
4. 프로젝트 생성이 완료될 때까지 대기합니다 (약 2분 소요).

## 2. 환경 변수 설정

1. Supabase 대시보드에서 **Settings** > **API**로 이동합니다.
2. 다음 정보를 확인합니다:

   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. 프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**주의**: `.env.local` 파일은 절대 Git에 커밋하지 마세요. 이미 `.gitignore`에 포함되어 있습니다.

## 3. Supabase 인증 설정

### 3.1 이메일 인증 활성화

1. Supabase 대시보드에서 **Authentication** > **Providers**로 이동합니다.
2. **Email** 프로바이더가 활성화되어 있는지 확인합니다.
3. 필요에 따라 다음 설정을 조정할 수 있습니다:
   - **Enable email confirmations**: 이메일 인증 필요 여부
   - **Secure email change**: 이메일 변경 시 재인증 필요 여부

### 3.2 이메일 템플릿 설정 (선택사항)

1. **Authentication** > **Email Templates**에서 이메일 템플릿을 커스터마이징할 수 있습니다.
2. 기본 템플릿을 사용하거나, 브랜드에 맞게 수정할 수 있습니다.

### 3.3 리다이렉트 URL 설정

1. **Authentication** > **URL Configuration**으로 이동합니다.
2. **Redirect URLs**에 다음 URL을 추가합니다:
   - `http://localhost:3000/auth/callback` (개발 환경)
   - `https://yourdomain.com/auth/callback` (프로덕션 환경)

## 4. Storage 설정 (프로필 이미지 업로드용)

프로필 이미지를 업로드하려면 Supabase Storage 버킷을 생성해야 합니다.

### 4.1 Storage 버킷 생성

1. Supabase 대시보드에서 **Storage**로 이동합니다.
2. **Create a new bucket** 버튼을 클릭합니다.
3. 다음 설정으로 버킷을 생성합니다:
   - **Name**: `profiles`
   - **Public bucket**: 체크 (공개 버킷으로 설정하여 이미지 URL 접근 가능)
4. **Create bucket** 버튼을 클릭합니다.

### 4.2 Storage 정책 설정

버킷 생성 후, 사용자가 자신의 프로필 이미지만 업로드할 수 있도록 정책을 설정합니다.

1. 생성한 `profiles` 버킷을 클릭합니다.
2. **Policies** 탭으로 이동합니다.
3. 다음 정책들을 추가합니다:

**업로드 정책 (INSERT)**:

```sql
CREATE POLICY "Users can upload own profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2]
);
```

**조회 정책 (SELECT)**:

```sql
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');
```

**업데이트 정책 (UPDATE)**:

```sql
CREATE POLICY "Users can update own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2]
);
```

**삭제 정책 (DELETE)**:

```sql
CREATE POLICY "Users can delete own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2]
);
```

**참고**: 위 정책은 파일 경로가 `profile-images/{user_id}/{filename}` 형식일 때 작동합니다. 현재 구현에서는 `profile-images/{user_id}-{timestamp}.{ext}` 형식을 사용하므로, 더 간단한 정책을 사용할 수 있습니다:

```sql
-- 업로드 정책 (간단 버전)
CREATE POLICY "Users can upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- 조회 정책 (공개)
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- 업데이트 정책
CREATE POLICY "Users can update profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles');

-- 삭제 정책
CREATE POLICY "Users can delete profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profiles');
```

### 4.3 매물 이미지용 Storage 버킷 생성

매물 이미지를 업로드하려면 별도의 Storage 버킷을 생성해야 합니다.

1. Supabase 대시보드에서 **Storage**로 이동합니다.
2. **Create a new bucket** 버튼을 클릭합니다.
3. 다음 설정으로 버킷을 생성합니다:
   - **Name**: `properties`
   - **Public bucket**: 체크 (공개 버킷으로 설정하여 이미지 URL 접근 가능)
4. **Create bucket** 버튼을 클릭합니다.

### 4.4 매물 이미지 Storage 정책 설정

버킷 생성 후, 인증된 사용자가 매물 이미지를 업로드할 수 있도록 정책을 설정합니다.

1. 생성한 `properties` 버킷을 클릭합니다.
2. **Policies** 탭으로 이동합니다.
3. `supabase/migrations/007_create_property_images_bucket.sql` 파일의 내용을 참고하여 다음 정책들을 추가합니다:

**업로드 정책 (INSERT)**:

```sql
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');
```

**조회 정책 (SELECT)**:

```sql
CREATE POLICY "Property images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'properties');
```

**업데이트 정책 (UPDATE)**:

```sql
CREATE POLICY "Users can update own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'properties' AND
  (storage.foldername(name))[1] = 'property-images' AND
  (storage.foldername(name))[2] LIKE auth.uid()::text || '%'
);
```

**삭제 정책 (DELETE)**:

```sql
CREATE POLICY "Users can delete own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'properties' AND
  (storage.foldername(name))[1] = 'property-images' AND
  (storage.foldername(name))[2] LIKE auth.uid()::text || '%'
);
```

### 4.5 Next.js Image 설정

Supabase Storage URL을 Next.js Image 컴포넌트에서 사용하려면 `next.config.ts`에 이미지 도메인을 추가해야 합니다:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};
```

## 5. 데이터베이스 스키마 설정

사용자 프로필 정보를 저장하려면 `profiles` 테이블을 생성합니다.

### 4.1 마이그레이션 파일 실행

`supabase/migrations/001_create_profiles_table.sql` 파일의 내용을 Supabase 대시보드의 **SQL Editor**에서 실행하거나, Supabase CLI를 사용하여 실행합니다.

**Supabase 대시보드에서 실행:**

1. Supabase 대시보드에서 **SQL Editor**로 이동합니다.
2. `supabase/migrations/001_create_profiles_table.sql` 파일의 내용을 복사하여 실행합니다.

**Supabase CLI 사용:**

```bash
supabase db push
```

### 4.2 테이블 구조

`profiles` 테이블은 다음 필드를 포함합니다:

- **기본 필드**: `id` (auth.users 참조), `created_at`, `updated_at`
- **프로필 정보**: `name`, `phone`, `profile_image` (모두 선택사항)
- **회사 정보**: `company_name`, `business_number`, `representative`, `company_phone`, `company_email`, `address`, `website` (모두 선택사항)

자세한 내용은 `supabase/PROFILES_TABLE_SETUP.md` 파일을 참고하세요.

## 6. 프로젝트 구조

Supabase 연동을 위해 다음 파일들이 생성되었습니다:

```
lib/
  ├── supabase/
  │   ├── client.ts      # 클라이언트 컴포넌트용 Supabase 클라이언트
  │   ├── server.ts       # 서버 컴포넌트용 Supabase 클라이언트
  │   └── middleware.ts   # 미들웨어용 Supabase 클라이언트
  └── auth.ts             # 인증 관련 유틸리티 함수들

middleware.ts             # Next.js 미들웨어
```

## 7. 사용 방법

### 6.1 클라이언트 컴포넌트에서 사용

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div>{user ? `안녕하세요, ${user.email}` : "로그인이 필요합니다"}</div>
  );
}
```

### 6.2 서버 컴포넌트에서 사용

```typescript
import { createClient } from "@/lib/supabase/server";

export default async function MyServerComponent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>{user ? `안녕하세요, ${user.email}` : "로그인이 필요합니다"}</div>
  );
}
```

### 6.3 인증 함수 사용

```typescript
import { signInWithEmail, signUpWithEmail, signOut } from "@/lib/auth";

// 로그인
const { user, error } = await signInWithEmail(email, password);

// 회원가입
const { user, error } = await signUpWithEmail(email, password, {
  data: { name: "홍길동" },
});

// 로그아웃
const { error } = await signOut();
```

## 8. 다음 단계

1. **인증 콜백 페이지 생성**: `/app/auth/callback/route.ts` 파일을 생성하여 이메일 인증 후 리다이렉트를 처리합니다.
2. **보호된 라우트 설정**: 인증이 필요한 페이지에 접근 제어를 추가합니다.
3. **사용자 프로필 관리**: 프로필 페이지에서 사용자 정보를 수정할 수 있도록 구현합니다.

## 9. 문제 해결

### 환경 변수가 인식되지 않는 경우

- `.env.local` 파일이 프로젝트 루트에 있는지 확인하세요.
- 개발 서버를 재시작하세요 (`npm run dev`).

### 인증이 작동하지 않는 경우

- Supabase 대시보드에서 프로젝트가 활성화되어 있는지 확인하세요.
- 리다이렉트 URL이 올바르게 설정되어 있는지 확인하세요.
- 브라우저 콘솔에서 에러 메시지를 확인하세요.

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
