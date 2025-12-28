/**
 * 환경 변수 확인 스크립트
 * node check-env.js 로 실행하여 환경 변수가 제대로 설정되어 있는지 확인합니다.
 */

const fs = require('fs');
const path = require('path');

console.log('=== 환경 변수 확인 ===\n');

const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

// .env.local 파일 확인
if (fs.existsSync(envLocalPath)) {
  console.log('✓ .env.local 파일이 존재합니다.');
  
  // 파일 내용 읽기 (실제 값은 보안상 표시하지 않음)
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  console.log('\n환경 변수 확인:');
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const hasVar = lines.some(line => line.startsWith(`${varName}=`));
    if (hasVar) {
      const line = lines.find(l => l.startsWith(`${varName}=`));
      const value = line.split('=')[1]?.trim();
      if (value && value.length > 0) {
        console.log(`  ✓ ${varName}: 설정됨 (값: ${value.substring(0, 20)}...)`);
      } else {
        console.log(`  ✗ ${varName}: 값이 비어있음`);
        allPresent = false;
      }
    } else {
      console.log(`  ✗ ${varName}: 설정되지 않음`);
      allPresent = false;
    }
  });
  
  if (allPresent) {
    console.log('\n✓ 모든 필수 환경 변수가 설정되어 있습니다.');
    console.log('\n다음 단계:');
    console.log('1. 개발 서버를 재시작하세요: npm run dev');
    console.log('2. 브라우저에서 로그인을 시도하세요');
    console.log('3. 브라우저 개발자 도구 콘솔에서 에러 메시지를 확인하세요');
  } else {
    console.log('\n✗ 일부 환경 변수가 설정되지 않았습니다.');
    console.log('\n해결 방법:');
    console.log('1. Supabase 대시보드에서 Settings > API로 이동');
    console.log('2. Project URL과 anon public key를 복사');
    console.log('3. .env.local 파일에 다음 형식으로 추가:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=your_project_url');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  }
} else if (fs.existsSync(envPath)) {
  console.log('⚠ .env 파일은 존재하지만 .env.local 파일이 없습니다.');
  console.log('Next.js는 .env.local 파일을 우선적으로 사용합니다.');
  console.log('\n.env.local 파일을 생성하세요:');
  console.log('1. .env 파일의 내용을 .env.local로 복사');
  console.log('2. 또는 SUPABASE_SETUP.md 파일의 가이드를 따라 새로 생성');
} else {
  console.log('✗ .env.local 파일이 없습니다.');
  console.log('\n환경 변수 파일을 생성하세요:');
  console.log('1. 프로젝트 루트에 .env.local 파일 생성');
  console.log('2. 다음 내용 추가:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('\n자세한 내용은 SUPABASE_SETUP.md 파일을 참고하세요.');
}

console.log('\n=== 확인 완료 ===');

