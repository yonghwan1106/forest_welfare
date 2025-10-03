-- 산림복지 시민정원사 확장 스키마
-- 알림, 커뮤니티, 소셜, 멘토링 기능 추가

-- 1. 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('activity_new', 'activity_reminder', 'grade_up', 'mentoring_match', 'community_reply', 'social_follow', 'activity_review')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 커뮤니티 게시글 테이블
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('review', 'qna', 'story', 'general')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 커뮤니티 댓글 테이블
CREATE TABLE IF NOT EXISTS community_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  parent_comment_id INTEGER REFERENCES community_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 좋아요 테이블
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 5. 북마크/즐겨찾기 테이블
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_id)
);

-- 6. 친구/팔로우 테이블
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 7. 그룹 테이블
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  image_url TEXT,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 그룹 멤버 테이블
CREATE TABLE IF NOT EXISTS group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- 9. 멘토링 세션 테이블
CREATE TABLE IF NOT EXISTS mentoring_sessions (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES mentoring_matches(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_type TEXT CHECK (meeting_type IN ('online', 'offline')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 멘토링 후기 테이블
CREATE TABLE IF NOT EXISTS mentoring_reviews (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES mentoring_sessions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 채팅방 테이블
CREATE TABLE IF NOT EXISTS chat_rooms (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'mentoring')),
  name TEXT,
  related_id INTEGER, -- mentoring_match_id or group_id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. 채팅 참여자 테이블
CREATE TABLE IF NOT EXISTS chat_participants (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- 13. 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. 뱃지 테이블
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  condition_type TEXT NOT NULL CHECK (condition_type IN ('participation_count', 'points', 'hours', 'special')),
  condition_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. 사용자 뱃지 테이블
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 활동 테이블에 위치 좌표 추가
ALTER TABLE activities ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_activity ON community_posts(activity_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(type);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_sessions_match ON mentoring_sessions(match_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_participants_room ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_location_coords ON activities(latitude, longitude);

-- RLS 활성화
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentoring_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- RLS 정책: notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS 정책: community_posts
CREATE POLICY "Anyone can view public posts"
  ON community_posts FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: community_comments
CREATE POLICY "Anyone can view comments"
  ON community_comments FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create comments"
  ON community_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON community_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON community_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: likes
CREATE POLICY "Users can view all likes"
  ON likes FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS 정책: follows
CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create follows"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- RLS 정책: groups
CREATE POLICY "Anyone can view public groups"
  ON groups FOR SELECT
  TO PUBLIC
  USING (is_public = true OR id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Group leaders can update their groups"
  ON groups FOR UPDATE
  USING (auth.uid() = leader_id);

CREATE POLICY "Group leaders can delete their groups"
  ON groups FOR DELETE
  USING (auth.uid() = leader_id);

-- RLS 정책: group_members
CREATE POLICY "Anyone can view group members"
  ON group_members FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON group_members FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM groups WHERE id = group_id AND leader_id = auth.uid()
  ));

-- RLS 정책: mentoring_sessions
CREATE POLICY "Mentors and mentees can view their sessions"
  ON mentoring_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM mentoring_matches
    WHERE id = match_id AND (mentor_id = auth.uid() OR mentee_id = auth.uid())
  ));

CREATE POLICY "Mentors and mentees can create sessions"
  ON mentoring_sessions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM mentoring_matches
    WHERE id = match_id AND (mentor_id = auth.uid() OR mentee_id = auth.uid())
  ));

CREATE POLICY "Mentors and mentees can update their sessions"
  ON mentoring_sessions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM mentoring_matches
    WHERE id = match_id AND (mentor_id = auth.uid() OR mentee_id = auth.uid())
  ));

-- RLS 정책: mentoring_reviews
CREATE POLICY "Anyone can view reviews"
  ON mentoring_reviews FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON mentoring_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- RLS 정책: chat_rooms
CREATE POLICY "Participants can view their chat rooms"
  ON chat_rooms FOR SELECT
  USING (id IN (
    SELECT room_id FROM chat_participants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create chat rooms"
  ON chat_rooms FOR INSERT
  WITH CHECK (true);

-- RLS 정책: chat_participants
CREATE POLICY "Participants can view chat participants"
  ON chat_participants FOR SELECT
  USING (room_id IN (
    SELECT room_id FROM chat_participants WHERE user_id = auth.uid()
  ));

CREATE POLICY "System can add chat participants"
  ON chat_participants FOR INSERT
  WITH CHECK (true);

-- RLS 정책: chat_messages
CREATE POLICY "Participants can view messages in their rooms"
  ON chat_messages FOR SELECT
  USING (room_id IN (
    SELECT room_id FROM chat_participants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Participants can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND room_id IN (
    SELECT room_id FROM chat_participants WHERE user_id = auth.uid()
  ));

-- RLS 정책: badges
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO PUBLIC
  USING (true);

-- RLS 정책: user_badges
CREATE POLICY "Anyone can view user badges"
  ON user_badges FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "System can award badges"
  ON user_badges FOR INSERT
  WITH CHECK (true);

-- 샘플 뱃지 데이터
INSERT INTO badges (code, name, description, condition_type, condition_value) VALUES
  ('first_step', '첫 걸음', '첫 활동에 참여했습니다', 'participation_count', 1),
  ('regular', '단골 참여자', '10개 활동에 참여했습니다', 'participation_count', 10),
  ('enthusiast', '열정가', '50개 활동에 참여했습니다', 'participation_count', 50),
  ('point_100', '포인트 수집가', '100포인트를 달성했습니다', 'points', 100),
  ('point_500', '포인트 마스터', '500포인트를 달성했습니다', 'points', 500),
  ('time_10', '10시간 달성', '10시간 활동했습니다', 'hours', 10),
  ('time_50', '50시간 달성', '50시간 활동했습니다', 'hours', 50),
  ('mentor', '멘토', '첫 멘토링을 시작했습니다', 'special', NULL),
  ('community_star', '커뮤니티 스타', '게시글이 100개 좋아요를 받았습니다', 'special', NULL),
  ('reviewer', '리뷰어', '10개 후기를 작성했습니다', 'special', NULL)
ON CONFLICT (code) DO NOTHING;

-- 완료 메시지
SELECT 'Extended schema created successfully!' AS status;
