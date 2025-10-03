-- RLS 정책 수정 (406 에러 해결)

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view activities" ON activities;
DROP POLICY IF EXISTS "Users can view their own participations" ON participations;
DROP POLICY IF EXISTS "Users can insert their own participations" ON participations;
DROP POLICY IF EXISTS "Users can update their own participations" ON participations;
DROP POLICY IF EXISTS "Users can view their own recommendations" ON recommendations;
DROP POLICY IF EXISTS "System can insert recommendations" ON recommendations;
DROP POLICY IF EXISTS "Users can update their own recommendations" ON recommendations;
DROP POLICY IF EXISTS "Users can view their own mentoring matches" ON mentoring_matches;

-- user_profiles 정책
CREATE POLICY "Enable read for authenticated users"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- activities 정책 (모든 인증된 사용자가 읽기 가능)
CREATE POLICY "Enable read for all authenticated users"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

-- participations 정책
CREATE POLICY "Enable read own participations"
  ON participations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert own participations"
  ON participations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update own participations"
  ON participations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- recommendations 정책
CREATE POLICY "Enable read own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update own recommendations"
  ON recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- mentoring_matches 정책
CREATE POLICY "Enable read own mentoring"
  ON mentoring_matches FOR SELECT
  TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- 완료 메시지
SELECT 'RLS policies updated successfully!' AS status;
