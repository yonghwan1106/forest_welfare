-- 산림복지 시민정원사 데이터베이스 스키마

-- 1. 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  birth_date DATE,
  age_group TEXT CHECK (age_group IN ('20s', '30s', '40s', '50s', '60s', '70s+')),
  region_sido TEXT,
  region_sigungu TEXT,
  interests TEXT[] DEFAULT '{}',
  available_times TEXT[] DEFAULT '{}',
  participation_frequency TEXT CHECK (participation_frequency IN ('weekly', 'biweekly', 'monthly', 'occasionally')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  total_points INTEGER DEFAULT 0,
  total_hours INTEGER DEFAULT 0,
  current_grade TEXT DEFAULT 'sprout' CHECK (current_grade IN ('sprout', 'tree', 'forest_keeper')),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 활동 테이블
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('healing', 'education', 'volunteer')),
  location_sido TEXT NOT NULL,
  location_sigungu TEXT NOT NULL,
  location_detail TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  points_reward INTEGER DEFAULT 0,
  hours_reward INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 참여 테이블
CREATE TABLE IF NOT EXISTS participations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'completed', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  points_earned INTEGER,
  hours_earned INTEGER,
  review TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(user_id, activity_id)
);

-- 4. AI 추천 테이블
CREATE TABLE IF NOT EXISTS recommendations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  reason TEXT,
  recommended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  applied BOOLEAN DEFAULT FALSE
);

-- 5. 멘토링 매칭 테이블 (향후 확장)
CREATE TABLE IF NOT EXISTS mentoring_matches (
  id SERIAL PRIMARY KEY,
  mentor_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'active', 'completed')),
  match_score INTEGER,
  matched_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_location ON activities(location_sido, location_sigungu);
CREATE INDEX IF NOT EXISTS idx_participations_user ON participations(user_id);
CREATE INDEX IF NOT EXISTS idx_participations_activity ON participations(activity_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_activity ON recommendations(activity_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentoring_matches ENABLE ROW LEVEL SECURITY;

-- RLS 정책: user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS 정책: activities (모든 사용자가 읽기 가능)
CREATE POLICY "Anyone can view activities"
  ON activities FOR SELECT
  TO PUBLIC
  USING (true);

-- RLS 정책: participations (본인의 참여만 조회/수정 가능)
CREATE POLICY "Users can view their own participations"
  ON participations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participations"
  ON participations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participations"
  ON participations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS 정책: recommendations (본인의 추천만 조회 가능)
CREATE POLICY "Users can view their own recommendations"
  ON recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own recommendations"
  ON recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS 정책: mentoring_matches
CREATE POLICY "Users can view their own mentoring matches"
  ON mentoring_matches FOR SELECT
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- 샘플 데이터 삽입
INSERT INTO activities (title, description, category, location_sido, location_sigungu, location_detail, date, start_time, end_time, difficulty, max_participants, points_reward, hours_reward)
VALUES
  ('북한산 숲길 걷기', '북한산 둘레길을 걸으며 자연을 느끼고 심신을 치유하는 프로그램입니다. 숲해설가와 함께 걷습니다.', 'healing', '서울특별시', '은평구', '북한산 둘레길 입구', '2025-11-15', '10:00', '13:00', 'beginner', 20, 30, 3),
  ('도시 정원 만들기', '도심 속 작은 정원을 함께 만들어보는 봉사활동입니다. 모종 심기와 화단 가꾸기를 배웁니다.', 'volunteer', '서울특별시', '마포구', '상암동 커뮤니티센터', '2025-11-18', '14:00', '17:00', 'beginner', 15, 40, 3),
  ('산림 생태 교육', '아이들과 함께하는 산림 생태 교육 프로그램입니다. 나무와 식물에 대해 배웁니다.', 'education', '경기도', '고양시', '일산 호수공원', '2025-11-20', '10:00', '12:00', 'intermediate', 30, 20, 2),
  ('명상의 숲 체험', '숲속에서 명상과 요가를 통해 마음의 평화를 찾는 치유 프로그램입니다.', 'healing', '강원특별자치도', '춘천시', '소양강 스카이워크 인근', '2025-11-22', '09:00', '12:00', 'beginner', 25, 35, 3),
  ('나무 심기 봉사', '산불 피해 지역에 나무를 심는 봉사활동입니다. 체력이 필요합니다.', 'volunteer', '강원특별자치도', '강릉시', '대관령면 산림', '2025-11-25', '08:00', '16:00', 'advanced', 40, 80, 8),
  ('허브 정원 가꾸기', '허브 식물을 직접 심고 가꾸며 허브의 효능에 대해 배우는 교육 프로그램입니다.', 'education', '경기도', '파주시', '파주 허브 농장', '2025-11-27', '13:00', '16:00', 'beginner', 20, 30, 3),
  ('가을 단풍 트레킹', '단풍이 아름다운 설악산 계곡을 걷는 치유 프로그램입니다.', 'healing', '강원특별자치도', '속초시', '설악산 국립공원', '2025-11-29', '08:00', '15:00', 'intermediate', 35, 60, 7),
  ('청소년 숲 해설', '청소년들에게 숲의 중요성을 알리는 교육 봉사활동입니다.', 'volunteer', '서울특별시', '강남구', '대모산 입구', '2025-12-01', '14:00', '17:00', 'intermediate', 10, 50, 3),
  ('겨울 준비하는 숲', '겨울을 준비하는 숲의 모습을 관찰하고 배우는 생태 교육입니다.', 'education', '인천광역시', '남동구', '소래습지생태공원', '2025-12-03', '10:00', '13:00', 'beginner', 25, 30, 3),
  ('산림욕 힐링 데이', '피톤치드 가득한 편백나무 숲에서 휴식하는 치유 프로그램입니다.', 'healing', '경기도', '가평군', '아침고요수목원', '2025-12-05', '10:00', '14:00', 'beginner', 30, 40, 4);

-- 완료 메시지
SELECT 'Database schema created successfully!' AS status;
