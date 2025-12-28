// Supabase 연결 테스트 스크립트
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env.local 파일 수동 로드
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Supabase 연결 테스트 ===\n');
console.log('환경 변수 확인:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ 설정됨' : '✗ 미설정');
console.log('- URL 값:', supabaseUrl);
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? `✓ 설정됨 (길이: ${supabaseKey.length})` : '✗ 미설정');
console.log('- Key 시작:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'N/A');
console.log();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('1. Supabase 연결 테스트 중...');

    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase.from('profiles').select('count');

    if (error) {
      console.error('❌ 연결 실패:', error.message);
      console.error('에러 코드:', error.code);
      console.error('에러 상세:', error);
      return;
    }

    console.log('✓ Supabase 연결 성공!');
    console.log();

    // 테스트 회원가입
    console.log('2. 테스트 회원가입 시도...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signupError) {
      console.error('❌ 회원가입 실패:', signupError.message);
      console.error('에러 상세:', signupError);
    } else {
      console.log('✓ 회원가입 성공!');
      console.log('사용자 ID:', signupData.user?.id);
      console.log('이메일:', signupData.user?.email);
      console.log();

      // 로그인 테스트
      console.log('3. 로그인 테스트...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (loginError) {
        console.error('❌ 로그인 실패:', loginError.message);
        console.error('에러 상세:', loginError);
      } else {
        console.log('✓ 로그인 성공!');
        console.log('사용자 ID:', loginData.user?.id);
        console.log('이메일:', loginData.user?.email);
      }
    }

  } catch (err) {
    console.error('❌ 테스트 중 오류 발생:', err);
  }
}

testConnection();
