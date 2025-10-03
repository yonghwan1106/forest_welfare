@echo off
echo Supabase 데이터베이스에 연결 중...
echo.
echo 환경 변수 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.
echo .env.local 파일에서 키를 설정하거나 다음 명령을 실행하세요:
echo setx SUPABASE_SERVICE_ROLE_KEY "your_service_role_key"
echo.
if "%SUPABASE_SERVICE_ROLE_KEY%"=="" (
    echo 오류: SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.
    pause
    exit /b 1
)
psql "postgresql://postgres:%SUPABASE_SERVICE_ROLE_KEY%@db.myqhtsvkbmfjrqfgrqkf.supabase.co:5432/postgres" -f supabase_schema.sql
pause
