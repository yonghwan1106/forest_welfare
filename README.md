# 🌲 산림복지 시민정원사

AI 기반 맞춤 산림 활동 추천 플랫폼

## 🚀 주요 기능

- ✅ 사용자 인증 (회원가입/로그인)
- ✅ 온보딩 및 프로필 설정
- ✅ AI 기반 맞춤 활동 추천 (Claude API)
- ✅ 활동 목록 및 상세 정보
- ✅ 활동 신청 및 관리
- ✅ 내 참여 활동 내역
- ✅ 등급 시스템 (새싹 → 나무 → 숲지키미)

## 🛠 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth)
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/yonghwan1106/forest_welfare.git
cd forest_welfare
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 4. Supabase 데이터베이스 설정

#### 4-1. 기본 스키마 생성

Supabase Dashboard → SQL Editor에서 `supabase_schema.sql` 파일 내용을 실행

#### 4-2. RLS 정책 수정 (중요!)

406 에러 해결을 위해 `supabase_fix_rls.sql` 파일 내용을 실행:

```sql
-- supabase_fix_rls.sql 파일의 내용을 Supabase SQL Editor에서 실행
```

#### 4-3. 이메일 인증 비활성화 (개발 환경)

Supabase Dashboard → Authentication → Providers → Email → "Confirm email" OFF

자세한 내용은 `docs/supabase_email_setup.md` 참조

### 5. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

### 6. 프로덕션 빌드

```bash
npm run build
npm start
```

## 🗄 데이터베이스 구조

### 주요 테이블

- **user_profiles**: 사용자 프로필 정보
- **activities**: 산림 활동 목록
- **participations**: 사용자 활동 참여 내역
- **recommendations**: AI 추천 결과
- **mentoring_matches**: 멘토링 매칭 (향후 확장)

## 🔒 보안 설정

### RLS (Row Level Security) 정책

- 사용자는 자신의 프로필만 읽기/수정 가능
- 활동은 모든 인증된 사용자가 읽기 가능
- 참여 내역은 본인만 조회/수정 가능
- 추천은 본인 것만 조회 가능

## 🐛 문제 해결

### 406 에러 (Not Acceptable)

Supabase RLS 정책 문제입니다. `supabase_fix_rls.sql` 파일을 실행하세요.

### "Email not confirmed" 에러

개발 환경에서는 이메일 인증을 비활성화하세요:
- Supabase Dashboard → Authentication → Providers → Email → "Confirm email" OFF

### 프로필이 저장되지 않음

1. `user_profiles` 테이블이 생성되었는지 확인
2. RLS 정책이 제대로 설정되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

## 📝 개발 문서

- [Supabase 이메일 설정 가이드](./docs/supabase_email_setup.md)
- [PRD 문서](./docs/forest_welfare_prd.md)
- [사용자 여정 맵](./docs/forest_welfare_user_journey.md)

## 🌐 배포

### Vercel 배포

1. GitHub 리포지토리 연결
2. 환경 변수 설정
3. 자동 배포

현재 배포 URL: https://forest-welfare.vercel.app

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!

## 📄 라이선스

MIT License

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
