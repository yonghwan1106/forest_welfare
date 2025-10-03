# 🌲 산림복지 시민정원사

> **2025년 산림복지 국민소통 혁신 아이디어 출품작**

AI 기반 맞춤 산림 활동 추천 플랫폼으로, 시민들이 자신에게 맞는 산림복지 프로그램을 쉽게 찾고 참여할 수 있도록 돕습니다.

**🔗 라이브 데모**: [https://forest-welfare.vercel.app](https://forest-welfare.vercel.app)

---

## 📖 프로젝트 소개

### 🎯 프로젝트 목적

산림복지 서비스에 대한 낮은 인지도와 복잡한 신청 절차로 인해 많은 시민들이 혜택을 받지 못하고 있습니다.
본 프로젝트는 **AI 기술**을 활용하여 개인 맞춤형 산림복지 프로그램을 추천하고, 직관적인 UI/UX로 참여 장벽을 낮추는 것을 목표로 합니다.

### 💡 핵심 가치

- 🤖 **AI 기반 개인화**: Claude AI를 활용한 맞춤형 활동 추천
- 🗺️ **직관적 검색**: 지도 기반 위치별 활동 탐색
- 📊 **참여 동기 부여**: 등급 시스템과 성취도 추적
- 💬 **커뮤니티**: 참여자 간 경험 공유 및 소통
- 🔔 **실시간 알림**: 활동 일정 및 중요 정보 알림

---

## ✅ 구현 완료 기능

### 🔐 사용자 인증 및 프로필
- ✅ 회원가입 / 로그인 (Supabase Auth)
- ✅ 이메일 인증 시스템
- ✅ 온보딩 프로세스 (관심사, 경험 수준 설정)
- ✅ 사용자 프로필 관리

### 🎯 활동 탐색 및 추천
- ✅ 활동 목록 조회 (지역, 카테고리 필터)
- ✅ 활동 상세 정보 페이지
- ✅ AI 기반 맞춤 활동 추천 (Claude API)
- ✅ 지도 기반 활동 위치 표시 (Kakao Map)
- ✅ 카테고리별 마커 시각화 (🌲 치유, 📚 교육, ❤️ 봉사)

### 📊 대시보드 및 참여 관리
- ✅ 개인 대시보드 (추천 활동, 참여 현황)
- ✅ 활동 신청 및 취소
- ✅ 내 참여 활동 내역
- ✅ 등급 시스템 (새싹 → 나무 → 숲지키미)
- ✅ 참여 시간 누적 추적

### 💬 커뮤니티
- ✅ 활동 후기 게시판
- ✅ 게시글 작성 및 조회
- ✅ 사진 공유 기능
- ✅ 카테고리별 게시글 필터링

### 🔔 알림 시스템
- ✅ 실시간 알림 표시
- ✅ 새로운 활동 등록 알림
- ✅ 활동 시작 D-day 알림
- ✅ 등급 상승 알림
- ✅ 멘토링 매칭 알림

### 🎨 UI/UX
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ Tailwind CSS 기반 모던 UI
- ✅ 직관적인 네비게이션
- ✅ 모든 페이지 사용자 이름 표시

---

## 🔄 구현 예정 기능

### Phase 2 (중기 계획)
- 🔄 **대시보드 시각화 확장**
  - 월별/연도별 참여 통계 그래프
  - 활동 카테고리별 참여도 차트
  - 뱃지/업적 시스템

- 📱 **소셜 기능**
  - 친구 추가 / 팔로우 시스템
  - 활동 함께 신청하기
  - 그룹/팀 만들기
  - 활동 리뷰 및 평점

- 👨‍🏫 **멘토링 시스템 완성**
  - 멘토/멘티 프로필 페이지
  - 1:1 채팅 기능
  - 멘토링 세션 일정 관리
  - 멘토링 후기 작성

### Phase 3 (장기 계획)
- ♿ **접근성 개선**
  - 다크모드 지원
  - 폰트 크기 조절
  - 고대비 모드
  - 스크린 리더 최적화

- 📱 **모바일 앱 기능**
  - PWA 변환 (오프라인 지원)
  - 위치 기반 서비스 강화
  - 카메라로 활동 인증 사진 촬영
  - 푸시 알림

- 🛠️ **관리자 기능**
  - 활동 등록/수정/삭제 대시보드
  - 사용자 통계 분석
  - 참여율 모니터링
  - 신고/문의 관리 시스템

- 🌦️ **추가 개인화**
  - 날씨 연동 활동 추천
  - 계절별 맞춤 프로그램
  - 사용자 행동 패턴 분석

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Kakao Map API

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **RLS**: Row Level Security 정책

### AI & APIs
- **AI**: Anthropic Claude 3.5 Sonnet
- **Recommendations**: Claude API 기반 맞춤 추천

### DevOps
- **Deployment**: Vercel
- **Version Control**: Git / GitHub
- **CI/CD**: Vercel 자동 배포

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

## 📊 프로젝트 구조

```
forest_welfare/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── activities/         # 활동 목록 및 상세
│   │   ├── auth/              # 로그인/회원가입
│   │   ├── community/         # 커뮤니티 게시판
│   │   ├── dashboard/         # 개인 대시보드
│   │   ├── my/                # 내 참여 활동
│   │   ├── onboarding/        # 온보딩
│   │   └── api/               # API 라우트
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── ActivityMap.tsx    # 활동 지도
│   │   ├── KakaoMap.tsx       # 카카오맵
│   │   └── NotificationBell.tsx # 알림
│   ├── lib/                   # 유틸리티 및 설정
│   │   └── supabase.ts        # Supabase 클라이언트
│   ├── types/                 # TypeScript 타입 정의
│   └── middleware.ts          # 인증 미들웨어
├── supabase/                  # 데이터베이스 스키마
│   ├── schema.sql             # 기본 스키마
│   └── seed.sql               # 샘플 데이터
└── docs/                      # 프로젝트 문서
```

## 📈 주요 성과

- ✅ **AI 추천 정확도**: 사용자 선호도 기반 맞춤형 활동 제안
- ✅ **직관적 UX**: 3단계 온보딩으로 빠른 서비스 이용 시작
- ✅ **실시간 알림**: 활동 일정 놓치지 않도록 D-day 알림
- ✅ **지도 시각화**: 위치 기반 활동 검색으로 접근성 향상
- ✅ **커뮤니티**: 참여자 간 경험 공유로 참여 동기 부여

## 📝 개발 문서

- [기능 개선 아이디어](./docs/improvement_ideas.md)
- [Supabase 이메일 설정 가이드](./docs/supabase_email_setup.md)
- [PRD 문서](./docs/forest_welfare_prd.md)
- [사용자 여정 맵](./docs/forest_welfare_user_journey.md)
- [구현 가이드](./docs/implementation_guide.md)

## 🌐 배포 및 데모

### 🔗 라이브 데모
**URL**: [https://forest-welfare.vercel.app](https://forest-welfare.vercel.app)

### 📱 주요 페이지
- **홈**: `/` - 플랫폼 소개 및 로그인
- **활동 목록**: `/activities` - 지도 및 필터 기능
- **대시보드**: `/dashboard` - AI 추천 및 참여 현황
- **커뮤니티**: `/community` - 활동 후기 공유
- **내 활동**: `/my/participations` - 참여 이력

### Vercel 자동 배포
1. GitHub 리포지토리 연결
2. 환경 변수 설정 (`.env.local` 참고)
3. `main` 브랜치 푸시 시 자동 배포

## 👥 팀 및 기여

**개발자**: yonghwan1106
**개발 도구**: Claude Code (AI 페어 프로그래밍)

이슈 및 풀 리퀘스트를 환영합니다!

## 📞 문의

- **GitHub Issues**: [프로젝트 이슈](https://github.com/yonghwan1106/forest_welfare/issues)
- **Email**: sanoramyun8@gmail.com

## 📄 라이선스

MIT License

---

**🏆 2025년 산림복지 국민소통 혁신 아이디어 출품작**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
