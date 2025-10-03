const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env.local에서 직접 읽기
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvValue = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? '✓ 있음' : '✗ 없음');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runSQL() {
  try {
    const sql = fs.readFileSync('supabase_schema.sql', 'utf8');

    console.log('\n=== Supabase 데이터베이스 스키마 생성 시작 ===\n');

    // Supabase REST API를 사용하여 SQL 실행
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('SQL 실행 실패:', error);

      console.log('\n=== Supabase Dashboard에서 직접 실행하세요 ===');
      console.log('1. https://supabase.com/dashboard 접속');
      console.log('2. 프로젝트 선택 (myqhtsvkbmfjrqfgrqkf)');
      console.log('3. SQL Editor 선택');
      console.log('4. supabase_schema.sql 파일 내용 복사 & 붙여넣기');
      console.log('5. Run 클릭\n');

      return;
    }

    const result = await response.json();
    console.log('✓ SQL 실행 성공:', result);

  } catch (error) {
    console.error('오류 발생:', error.message);

    console.log('\n=== Supabase Dashboard에서 직접 실행하세요 ===');
    console.log('1. https://supabase.com/dashboard 접속');
    console.log('2. 프로젝트 선택 (myqhtsvkbmfjrqfgrqkf)');
    console.log('3. SQL Editor 선택');
    console.log('4. supabase_schema.sql 파일 내용 복사 & 붙여넣기');
    console.log('5. Run 클릭\n');
  }
}

runSQL();
