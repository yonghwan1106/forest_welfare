# 산림복지 플랫폼 기능 구현 가이드

## ✅ 완료된 기능

### 1. 데이터베이스 스키마
- 파일: `supabase_extended_schema.sql`
- Supabase SQL Editor에서 실행 필요
- 포함 테이블: 알림, 커뮤니티, 소셜, 멘토링, 채팅, 뱃지

### 2. 카카오맵 API 지도 기능
- `src/components/KakaoMap.tsx` - 단일 위치 지도
- `src/components/ActivityMap.tsx` - 다중 마커 지도
- `/activities` - 지도 보기 토글 버튼
- `/activities/[id]` - 활동 위치 지도 표시

### 3. 실시간 알림 시스템
- `src/components/NotificationBell.tsx`
- Supabase Realtime 구독
- 모든 주요 페이지 헤더에 추가됨

### 4. 커뮤니티 기능 (부분 완료)
- `/community` - 게시판 목록
- `/community/write` - 글쓰기

## 🔨 추가 구현이 필요한 기능

### 5. 커뮤니티 상세 및 댓글
필요한 페이지:
- `/community/[id]/page.tsx` - 게시글 상세, 댓글 작성/표시
- `src/components/CommentSection.tsx` - 댓글 컴포넌트

주요 기능:
- 게시글 조회수 증가
- 좋아요 토글
- 댓글 작성/삭제
- 대댓글 지원

### 6. 검색 및 필터링
필요한 컴포넌트:
- `src/components/ActivityFilters.tsx` - 고급 필터링
  - 날짜 범위
  - 난이도
  - 카테고리
  - 지역
  - 검색어

- `src/components/SearchBar.tsx` - 통합 검색

### 7. 대시보드 시각화
필요한 컴포넌트:
- `src/components/StatsChart.tsx` - Recharts 사용
  - 월별 참여 통계
  - 카테고리별 참여도

- `src/components/GradeProgress.tsx` - 등급 진행도
- `src/components/BadgeCollection.tsx` - 뱃지 컬렉션
- `src/components/ActivityCalendar.tsx` - 활동 캘린더

라이브러리 설치:
```bash
npm install recharts date-fns
```

### 8. 소셜 기능
필요한 페이지:
- `/users/[id]/page.tsx` - 사용자 프로필
- `/users/[id]/followers` - 팔로워 목록
- `/users/[id]/following` - 팔로잉 목록
- `/groups` - 그룹 목록
- `/groups/[id]` - 그룹 상세
- `/groups/create` - 그룹 생성

필요한 컴포넌트:
- `src/components/FollowButton.tsx` - 팔로우 버튼
- `src/components/UserCard.tsx` - 사용자 카드
- `src/components/GroupCard.tsx` - 그룹 카드

### 9. 멘토링 시스템
필요한 페이지:
- `/mentoring` - 멘토링 대시보드
- `/mentoring/find` - 멘토/멘티 찾기
- `/mentoring/sessions` - 세션 관리
- `/mentoring/chat/[roomId]` - 채팅방

필요한 컴포넌트:
- `src/components/MentorCard.tsx` - 멘토 카드
- `src/components/SessionCalendar.tsx` - 세션 일정
- `src/components/ChatRoom.tsx` - 채팅 인터페이스
- `src/components/MentoringReview.tsx` - 멘토링 후기

### 10. 북마크 기능
필요한 기능:
- 활동 북마크 토글 버튼
- `/my/bookmarks` - 북마크한 활동 목록

## 📦 설치 필요한 라이브러리

```bash
# 차트 라이브러리
npm install recharts

# 날짜 처리
npm install date-fns

# 폼 관리 (선택)
npm install react-hook-form zod @hookform/resolvers

# 이미지 업로드 (선택)
npm install react-dropzone
```

## 🗄️ Supabase 설정

### 1. 확장 스키마 적용
```sql
-- supabase_extended_schema.sql 파일 실행
```

### 2. 샘플 데이터에 위치 좌표 추가
```sql
-- 활동에 위치 좌표 추가 예시
UPDATE activities
SET latitude = 37.6587, longitude = 126.9116
WHERE location_sido = '서울특별시' AND location_sigungu = '은평구';

UPDATE activities
SET latitude = 37.5796, longitude = 126.8895
WHERE location_sido = '서울특별시' AND location_sigungu = '마포구';

-- 나머지 활동들도 동일하게 설정
```

### 3. Storage 버킷 생성 (이미지 업로드용)
- Supabase Dashboard → Storage
- 버킷 이름: `community-images`, `user-avatars`
- Public 설정

### 4. Realtime 활성화
- Supabase Dashboard → Database → Replication
- `notifications` 테이블 Realtime 활성화

## 🎨 UI/UX 개선 사항

### 1. 반응형 디자인
- 모바일 최적화
- 태블릿 레이아웃

### 2. 로딩 상태
- Skeleton UI 추가
- Loading spinner 개선

### 3. 에러 처리
- Toast 알림 시스템
- 에러 바운더리

### 4. 접근성
- ARIA 레이블
- 키보드 네비게이션
- 스크린 리더 지원

## 🚀 배포 전 체크리스트

- [ ] 모든 환경 변수 Vercel에 설정
- [ ] Supabase 확장 스키마 적용
- [ ] 활동 데이터에 위치 좌표 추가
- [ ] Storage 버킷 생성 및 RLS 정책 설정
- [ ] Realtime 활성화
- [ ] 프로덕션 빌드 테스트
- [ ] 성능 최적화 (이미지 압축, 코드 스플리팅)
- [ ] SEO 메타 태그 추가

## 📝 다음 우선순위

1. **커뮤니티 상세 페이지 완성** (가장 시급)
2. **대시보드 시각화** (사용자 경험 향상)
3. **검색/필터링 고도화** (편의성)
4. **소셜 기능** (사용자 참여)
5. **멘토링 시스템** (핵심 기능)

---

작성일: 2025-10-03
