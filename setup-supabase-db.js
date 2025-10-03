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

// Database URL 추출 (프로젝트 ID 기반)
const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)[1];
const dbUrl = `postgresql://postgres:${encodeURIComponent(supabaseServiceKey)}@db.${projectRef}.supabase.co:5432/postgres`;

console.log('=== Supabase 데이터베이스 스키마 설정 ===\n');
console.log('프로젝트 ID:', projectRef);
console.log('Supabase URL:', supabaseUrl);
console.log('\n다음 두 가지 방법 중 하나를 선택하세요:\n');

console.log('방법 1: Supabase Dashboard 사용 (추천)');
console.log('----------------------------------------');
console.log('1. https://supabase.com/dashboard/project/' + projectRef + '/sql 접속');
console.log('2. 아래 "New query" 클릭');
console.log('3. supabase_schema.sql 파일 내용 복사 & 붙여넣기');
console.log('4. "Run" 버튼 클릭\n');

console.log('방법 2: psql 명령줄 사용');
console.log('----------------------------------------');
console.log('PostgreSQL이 설치되어 있다면 다음 명령어 실행:\n');

const sqlContent = fs.readFileSync('supabase_schema.sql', 'utf8');
fs.writeFileSync('run-schema.bat', `@echo off
echo Supabase 데이터베이스에 연결 중...
psql "${dbUrl}" -f supabase_schema.sql
pause
`);

console.log('psql "' + dbUrl + '" -f supabase_schema.sql\n');
console.log('또는 run-schema.bat 파일을 실행하세요.\n');

console.log('방법 3: SQL 내용 확인');
console.log('----------------------------------------');
console.log('supabase_schema.sql 파일 위치:');
console.log(path.resolve('supabase_schema.sql'));
console.log('\n');

// 스키마 요약 출력
console.log('생성될 테이블:');
console.log('- user_profiles: 사용자 프로필');
console.log('- activities: 활동 정보');
console.log('- participations: 참여 기록');
console.log('- recommendations: AI 추천');
console.log('- mentoring_matches: 멘토링 매칭');
console.log('\n샘플 데이터: 10개의 활동이 자동으로 추가됩니다.');
