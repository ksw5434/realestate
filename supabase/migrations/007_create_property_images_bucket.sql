-- 매물 이미지를 위한 Storage 버킷 생성 및 정책 설정
-- 이 마이그레이션은 Supabase 대시보드에서 Storage 버킷을 생성한 후 정책을 설정하는 SQL입니다.

-- 주의: Storage 버킷은 SQL로 직접 생성할 수 없으므로, 
-- 먼저 Supabase 대시보드에서 버킷을 생성해야 합니다.
-- 
-- 버킷 생성 방법:
-- 1. Supabase 대시보드 > Storage로 이동
-- 2. "Create a new bucket" 클릭
-- 3. Name: properties
-- 4. Public bucket: 체크 (공개 버킷으로 설정)
-- 5. Create bucket 클릭

-- ============================================
-- Storage 정책 설정
-- ============================================

-- 업로드 정책 (INSERT): 인증된 사용자는 매물 이미지를 업로드할 수 있음
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');

-- 조회 정책 (SELECT): 모든 사용자가 매물 이미지를 조회할 수 있음 (공개)
CREATE POLICY "Property images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'properties');

-- 업데이트 정책 (UPDATE): 인증된 사용자는 자신이 업로드한 매물 이미지를 수정할 수 있음
-- 파일 경로에 사용자 ID가 포함되어 있으므로, 해당 사용자만 수정 가능
CREATE POLICY "Users can update own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'properties' AND
  (storage.foldername(name))[1] = 'property-images' AND
  (storage.foldername(name))[2] LIKE auth.uid()::text || '%'
);

-- 삭제 정책 (DELETE): 인증된 사용자는 자신이 업로드한 매물 이미지를 삭제할 수 있음
CREATE POLICY "Users can delete own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'properties' AND
  (storage.foldername(name))[1] = 'property-images' AND
  (storage.foldername(name))[2] LIKE auth.uid()::text || '%'
);

-- 참고: 
-- - 파일 경로 형식: property-images/{user_id}-{timestamp}-{index}.{ext}
-- - 위 정책은 파일명에 사용자 ID가 포함되어 있을 때 작동합니다.
-- - 더 엄격한 정책이 필요하다면, properties 테이블의 created_by와 연동하여 
--   매물 소유자만 이미지를 관리할 수 있도록 할 수 있습니다.

