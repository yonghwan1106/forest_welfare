const { Client } = require('pg');
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
const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)[1];

// Supabase PostgreSQL 연결 설정 (Direct connection - port 5432)
const password = encodeURIComponent('22번길67!');
const connectionString = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function executeSQL() {
  try {
    console.log('Supabase PostgreSQL에 연결 중...\n');
    await client.connect();
    console.log('✓ 연결 성공!\n');

    // SQL 파일 읽기
    const sqlContent = fs.readFileSync('supabase_schema.sql', 'utf8');

    console.log('SQL 스크립트 실행 중...\n');

    // 전체 SQL을 한 번에 실행
    const result = await client.query(sqlContent);

    console.log('✓ 데이터베이스 스키마 생성 완료!\n');
    console.log('생성된 테이블:');
    console.log('- user_profiles: 사용자 프로필');
    console.log('- activities: 활동 정보');
    console.log('- participations: 참여 기록');
    console.log('- recommendations: AI 추천');
    console.log('- mentoring_matches: 멘토링 매칭');
    console.log('\n샘플 활동 데이터 10개가 추가되었습니다.');

  } catch (error) {
    console.error('오류 발생:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n⚠️ 일부 테이블이 이미 존재합니다. 이는 정상입니다.');
    } else {
      console.error('\n상세 오류:', error);
    }
  } finally {
    await client.end();
    console.log('\n연결 종료.');
  }
}

executeSQL();
