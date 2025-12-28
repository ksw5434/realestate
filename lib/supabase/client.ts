import { createBrowserClient } from '@supabase/ssr'

/**
 * 클라이언트 컴포넌트에서 사용할 Supabase 클라이언트 생성
 * 브라우저 환경에서 쿠키를 자동으로 관리합니다.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

