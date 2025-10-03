# 산림복지 시민정원사 플랫폼 PRD

## 1. 제품 개요

### 1.1 목적
공모전 제출용 실제 작동하는 프로토타입으로, 심사위원이 직접 회원가입부터 AI 추천까지 전체 사용자 여정을 체험할 수 있는 서비스

### 1.2 목표
- 심사위원이 5분 내 핵심 기능 체험 완료
- AI 매칭의 실제 작동 입증
- 확장 가능한 아키텍처 시연

### 1.3 기술 스택
- **프론트엔드**: Next.js 14 (App Router)
- **백엔드**: Next.js API Routes
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **AI**: Claude Sonnet 4.0 API
- **배포**: Vercel
- **지도**: Kakao Map API 

---

## 2. MVP 기능 정의

### 2.1 Phase 1 - 필수 핵심 기능 (2주)

#### ✅ 회원 인증 시스템
- 이메일 회원가입/로그인
- 소셜 로그인 (Google) - 선택
- 비밀번호 재설정

#### ✅ 온보딩 & 프로필 설정
**Step 1: 기본 정보**
- 이름 (닉네임)
- 생년월일 (연령대 계산용)
- 거주 지역 (시/도, 시/군/구)

**Step 2: 관심사 선택**
- 산림치유 (스트레스 해소, 명상, 산책)
- 생태교육 (자연 학습, 식물 관찰, 환경보호)
- 봉사활동 (숲길 정비, 쓰레기 수거, 안내 도우미)
- 멘토링 (지식 전달, 청소년 지도)

**Step 3: 가용 시간**
- 평일 오전 / 평일 오후 / 주말 오전 / 주말 오후
- 월 참여 가능 횟수 (1-2회 / 3-4회 / 5회 이상)

**Step 4: 경험 수준**
- 산림복지 경험 없음
- 1-2회 참여 경험
- 정기적 참여 (3회 이상)
- 전문가 (관련 직업 또는 자격증 보유)

#### ✅ AI 맞춤 활동 추천
**입력 데이터**
- 사용자 프로필 (연령대, 지역, 관심사, 가용시간, 경험)
- 기존 참여 이력

**Claude API 활용**
```
프롬프트 예시:
"다음 사용자에게 가장 적합한 산림복지 활동 3개를 추천해주세요.
- 연령대: 30대
- 거주지역: 경기도 용인시
- 관심사: 산림치유, 봉사활동
- 가용시간: 주말 오전, 월 3-4회
- 경험: 1-2회 참여 경험

활동 목록:
[DB에서 가져온 활동 목록 JSON]

JSON 형식으로 응답:
{
  "recommendations": [
    {
      "activity_id": 1,
      "match_score": 95,
      "reason": "추천 이유 2문장"
    }
  ]
}"
```

**출력 결과**
- 추천 활동 3개 (매칭점수 순)
- 추천 이유 표시
- 바로 신청 가능

#### ✅ 활동 목록 및 상세
**활동 정보**
- 제목, 설명, 장소, 일시
- 난이도 (초급/중급/고급)
- 카테고리 (치유/교육/봉사)
- 참여 인원 (현재/최대)
- 참여 시 획득 포인트

**필터링**
- 지역별
- 카테고리별
- 날짜별
- 난이도별

#### ✅ 활동 신청 & 참여 관리
- 활동 신청하기 버튼
- 신청 내역 조회 (예정 활동)
- 참여 완료 처리 (관리자 승인 또는 QR 인증)
- 참여 내역 조회 (완료 활동)

#### ✅ 포인트 & 등급 시스템
**등급 체계**
- 새싹 (0-10시간): 10% 할인
- 나무 (10-30시간): 우선예약 + 20% 할인
- 숲지키 (30시간+): 연간 무료 이용권

**포인트 적립**
- 활동 참여 시간에 비례 (1시간 = 1포인트)
- 후기 작성 보너스 (+2포인트)
- 출석체크 보너스 (연속 참여)

#### ✅ 대시보드
- 나의 등급 및 진행률
- 누적 참여 시간
- 다음 등급까지 남은 시간
- AI 추천 활동 3개
- 최근 참여 활동
- 알림 (신청 활동 D-day 등)

### 2.2 Phase 2 - 고급 기능 (선택)

#### 🔄 세대간 멘토링 매칭
**조건**
- 멘토: 50세 이상 + 전문가 경험 수준
- 멘티: 30세 이하 OR 경험 없음

**Claude API 매칭**
- 관심사 유사도 분석
- 지역 근접성 고려
- 성향 매칭 (프로필 분석)

#### 🔄 커뮤니티 기능
- 활동 후기 작성
- 사진 업로드
- 다른 참여자 후기 보기
- 좋아요/댓글

#### 🔄 위치기반 미션 (선택)
- Kakao Map API 연동
- 사용자 위치 기반 주변 활동 표시
- 즉석 미션 푸시 알림

---

## 3. 데이터베이스 스키마

### 3.1 Supabase Tables

#### `users` (확장 프로필)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nickname VARCHAR(50),
  birth_date DATE,
  age_group VARCHAR(20), -- '20대', '30대', etc.
  region_sido VARCHAR(50),
  region_sigungu VARCHAR(50),
  interests TEXT[], -- ['healing', 'education', 'volunteer', 'mentoring']
  available_times TEXT[], -- ['weekday_morning', 'weekend_afternoon', etc.]
  participation_frequency VARCHAR(20), -- '1-2times', '3-4times', '5+times'
  experience_level VARCHAR(20), -- 'none', 'beginner', 'regular', 'expert'
  total_points INTEGER DEFAULT 0,
  total_hours DECIMAL(5,2) DEFAULT 0,
  current_grade VARCHAR(20) DEFAULT 'sprout', -- 'sprout', 'tree', 'forest_keeper'
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `activities`
```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'healing', 'education', 'volunteer'
  location_sido VARCHAR(50),
  location_sigungu VARCHAR(50),
  location_detail VARCHAR(200),
  date DATE,
  start_time TIME,
  end_time TIME,
  difficulty VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  points_reward INTEGER, -- 참여시 획득 포인트
  hours_reward DECIMAL(3,1), -- 참여시 획득 시간
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed', 'completed'
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `participations`
```sql
CREATE TABLE participations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  activity_id INTEGER REFERENCES activities(id),
  status VARCHAR(20) DEFAULT 'registered', -- 'registered', 'completed', 'cancelled'
  registered_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  points_earned INTEGER,
  hours_earned DECIMAL(3,1),
  review TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);
```

#### `recommendations` (AI 추천 이력)
```sql
CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  activity_id INTEGER REFERENCES activities(id),
  match_score INTEGER, -- 0-100
  reason TEXT,
  recommended_at TIMESTAMP DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  applied BOOLEAN DEFAULT FALSE
);
```

#### `mentoring_matches`
```sql
CREATE TABLE mentoring_matches (
  id SERIAL PRIMARY KEY,
  mentor_id UUID REFERENCES users(id),
  mentee_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'proposed', -- 'proposed', 'accepted', 'active', 'completed'
  match_score INTEGER,
  matched_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. API 엔드포인트

### 4.1 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 4.2 프로필
- `GET /api/profile` - 내 프로필 조회
- `PUT /api/profile` - 프로필 업데이트
- `POST /api/profile/onboarding` - 온보딩 완료

### 4.3 활동
- `GET /api/activities` - 활동 목록 (필터링)
- `GET /api/activities/:id` - 활동 상세
- `POST /api/activities/:id/apply` - 활동 신청

### 4.4 AI 추천
- `POST /api/recommendations/generate` - AI 활동 추천 생성
- `GET /api/recommendations` - 내 추천 목록

### 4.5 참여관리
- `GET /api/participations` - 내 참여 내역
- `POST /api/participations/:id/complete` - 참여 완료 처리
- `POST /api/participations/:id/review` - 후기 작성

### 4.6 대시보드
- `GET /api/dashboard` - 대시보드 데이터 (통합)

---

## 5. 페이지 구조

### 5.1 공개 페이지
```
/ (홈)
  - 서비스 소개
  - 주요 기능 3가지
  - 로그인/회원가입 버튼
  
/about
  - 공모전 제안 내용
  - 기대효과
  - 데모 안내
```

### 5.2 인증 페이지
```
/auth/signup - 회원가입
/auth/login - 로그인
/auth/reset-password - 비밀번호 재설정
```

### 5.3 온보딩
```
/onboarding
  - Step 1: 기본정보
  - Step 2: 관심사
  - Step 3: 가용시간
  - Step 4: 경험수준
  - 완료 → 대시보드로 이동
```

### 5.4 메인 서비스
```
/dashboard (로그인 필수)
  - 나의 현황 (등급, 포인트, 시간)
  - AI 추천 활동 3개
  - 최근 참여 활동
  - 예정된 활동
  
/activities
  - 활동 목록 (필터링)
  - 검색
  
/activities/:id
  - 활동 상세
  - 신청하기 버튼
  
/my/participations
  - 신청 내역
  - 참여 완료 내역
  
/my/profile
  - 프로필 수정
  - 관심사 변경
```

---

## 6. UI/UX 디자인 원칙

### 6.1 디자인 시스템
- **색상**: 
  - Primary: 초록 (#2D5016 - 산림)
  - Secondary: 하늘색 (#87CEEB - 맑은 공기)
  - Accent: 주황 (#FF8C42 - 따뜻함)
- **타이포그래피**: 
  - 헤더: Pretendard Bold
  - 본문: Pretendard Regular
- **컴포넌트**: shadcn/ui 활용

### 6.2 반응형 디자인
- 모바일 퍼스트 (375px 기준)
- 태블릿 (768px)
- 데스크탑 (1024px+)

### 6.3 접근성
- WCAG 2.1 AA 준수
- 키보드 네비게이션
- 스크린 리더 지원

---

## 7. 개발 우선순위

### Week 1
- [ ] Next.js 프로젝트 설정
- [ ] Supabase 프로젝트 생성 및 테이블 구축
- [ ] 인증 시스템 구현 (Supabase Auth)
- [ ] 기본 레이아웃 및 라우팅

### Week 2
- [ ] 온보딩 플로우 구현
- [ ] 활동 목록/상세 페이지
- [ ] 대시보드 UI

### Week 3
- [ ] Claude API 연동 (AI 추천)
- [ ] 활동 신청/참여 관리
- [ ] 포인트/등급 시스템 로직

### Week 4
- [ ] 멘토링 매칭 (선택)
- [ ] 버그 수정 및 최적화
- [ ] Vercel 배포 및 테스트

---

## 8. 성공 지표

### 8.1 기술적 지표
- 페이지 로드 속도 < 2초
- Lighthouse 점수 > 90
- AI 추천 응답 시간 < 3초

### 8.2 사용성 지표
- 온보딩 완료율 > 80%
- AI 추천 클릭률 > 40%
- 활동 신청 전환율 > 20%

### 8.3 공모전 평가 대응
- 실제 작동하는 AI 매칭 입증 ✅
- 확장 가능한 아키텍처 시연 ✅
- 사용자 경험의 우수성 입증 ✅

---

## 9. 제약사항 및 가정

### 9.1 제약사항
- 개발 기간: 4주
- 예산: 무료 티어 활용 (Vercel Hobby, Supabase Free)
- Claude API: 월 $50 예산

### 9.2 가정
- 초기 활동 데이터는 시드 데이터로 수동 입력
- 실제 결제 기능은 UI만 구현 (실제 결제 X)
- QR 체크인은 간소화 (버튼 클릭으로 대체)
- 관리자 기능은 최소화

### 9.3 제외 기능
- 실시간 채팅
- 복잡한 게이미피케이션
- 위치 추적 (Phase 2로 연기)
- 결제 시스템

---

## 10. 리스크 및 대응

### 10.1 기술적 리스크
**리스크**: Claude API 비용 초과
**대응**: 캐싱 전략, 월 한도 설정

**리스크**: Supabase 무료 티어 제한
**대응**: 데이터 정리, 인덱싱 최적화

### 10.2 일정 리스크
**리스크**: 개발 지연
**대응**: MVP 기능 축소, Phase 2 기능 제외

---

## 11. 배포 전략

### 11.1 환경 구성
- **개발**: localhost:3000
- **스테이징**: staging.forestkeeper.vercel.app
- **프로덕션**: forestkeeper.vercel.app (또는 커스텀 도메인)

### 11.2 환경 변수
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_KAKAO_MAP_KEY=  
```

### 11.3 CI/CD
- GitHub Actions 또는 Vercel 자동 배포
- main 브랜치 푸시시 자동 배포
- PR 생성시 프리뷰 배포

---

## 12. 데모 시나리오 (심사위원용)

### 시나리오 A: 30대 직장인 (5분)
1. 회원가입 (30초)
2. 온보딩: 경기도 용인, 산림치유 관심, 주말 가능 (1분)
3. AI 추천 활동 확인 → "광교호수공원 힐링 워크" 추천 (1분)
4. 활동 상세 확인 및 신청 (1분)
5. 대시보드에서 신청 내역 확인 (30초)
6. 프로필에서 등급/포인트 확인 (1분)

### 시나리오 B: 60대 은퇴자 (5분)
1. 회원가입 (30초)
2. 온보딩: 서울 강남, 멘토링 관심, 전문가 수준 (1분)
3. AI 추천 → "청소년 생태교육 멘토" 추천 (1분)
4. 활동 신청 (1분)
5. 멘토링 매칭 제안 확인 (1분)
6. 전체 활동 목록 필터링 시연 (30초)

---

## 부록: 샘플 데이터

### 활동 예시 10개
1. **광교호수공원 힐링 워크** (경기 수원, 산림치유, 초급)
2. **청계산 명상 프로그램** (경기 과천, 산림치유, 중급)
3. **어린이 숲체험 교실** (서울 강남, 생태교육, 초급)
4. **숲길 정비 봉사** (경기 용인, 봉사활동, 초급)
5. **산림해설사와 함께하는 둘레길** (서울 종로, 생태교육, 초급)
6. **치유의 숲 요가교실** (경기 광주, 산림치유, 중급)
7. **청소년 생태탐사대** (서울 서초, 생태교육, 중급)
8. **숲속 목공예 체험** (경기 양평, 생태교육, 초급)
9. **시니어 숲길 안내 봉사** (서울 송파, 봉사활동, 중급)
10. **산림욕 명상 리트릿** (강원 춘천, 산림치유, 고급)