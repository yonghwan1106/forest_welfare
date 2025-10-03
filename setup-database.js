const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Supabase 데이터베이스에 연결 중...');

    // SQL 파일 읽기
    const sql = fs.readFileSync('supabase_schema.sql', 'utf8');

    // SQL 문을 세미콜론으로 분리
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`총 ${statements.length}개의 SQL 문을 실행합니다...`);

    // 각 SQL 문 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n[${i + 1}/${statements.length}] 실행 중...`);
      console.log(statement.substring(0, 100) + '...');

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });

      if (error) {
        console.error('오류 발생:', error);
        // 테이블이 이미 존재하는 등의 일부 오류는 무시
        if (!error.message.includes('already exists')) {
          throw error;
        }
      } else {
        console.log('✓ 성공');
      }
    }

    console.log('\n데이터베이스 스키마 생성 완료!');
  } catch (error) {
    console.error('데이터베이스 설정 중 오류 발생:', error);
    process.exit(1);
  }
}

setupDatabase();
