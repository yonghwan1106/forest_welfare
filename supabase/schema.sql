-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extended profile)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname VARCHAR(50),
  birth_date DATE,
  age_group VARCHAR(20),
  region_sido VARCHAR(50),
  region_sigungu VARCHAR(50),
  interests TEXT[],
  available_times TEXT[],
  participation_frequency VARCHAR(20),
  experience_level VARCHAR(20),
  total_points INTEGER DEFAULT 0,
  total_hours DECIMAL(5,2) DEFAULT 0,
  current_grade VARCHAR(20) DEFAULT 'sprout',
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  location_sido VARCHAR(50),
  location_sigungu VARCHAR(50),
  location_detail VARCHAR(200),
  date DATE,
  start_time TIME,
  end_time TIME,
  difficulty VARCHAR(20),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  points_reward INTEGER,
  hours_reward DECIMAL(3,1),
  status VARCHAR(20) DEFAULT 'open',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Participations table
CREATE TABLE participations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  points_earned INTEGER,
  hours_earned DECIMAL(3,1),
  review TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Recommendations table
CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  match_score INTEGER,
  reason TEXT,
  recommended_at TIMESTAMP DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  applied BOOLEAN DEFAULT FALSE
);

-- Mentoring matches table
CREATE TABLE mentoring_matches (
  id SERIAL PRIMARY KEY,
  mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'proposed',
  match_score INTEGER,
  matched_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_region ON users(region_sido, region_sigungu);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_participations_user ON participations(user_id);
CREATE INDEX idx_participations_activity ON participations(activity_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentoring_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for activities table
CREATE POLICY "Anyone can view open activities"
  ON activities FOR SELECT
  USING (status = 'open' OR status = 'closed' OR status = 'completed');

-- RLS Policies for participations table
CREATE POLICY "Users can view their own participations"
  ON participations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participations"
  ON participations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participations"
  ON participations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for recommendations table
CREATE POLICY "Users can view their own recommendations"
  ON recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
  ON recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for mentoring_matches table
CREATE POLICY "Users can view their own mentoring matches"
  ON mentoring_matches FOR SELECT
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can update their own mentoring matches"
  ON mentoring_matches FOR UPDATE
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
