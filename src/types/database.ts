export type UserProfile = {
  id: string;
  nickname: string;
  birth_date: string;
  age_group: string;
  region_sido: string;
  region_sigungu: string;
  interests: string[];
  available_times: string[];
  participation_frequency: string;
  experience_level: string;
  total_points: number;
  total_hours: number;
  current_grade: 'sprout' | 'tree' | 'forest_keeper';
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: number;
  title: string;
  description: string;
  category: 'healing' | 'education' | 'volunteer';
  location_sido: string;
  location_sigungu: string;
  location_detail: string;
  latitude?: number;
  longitude?: number;
  date: string;
  start_time: string;
  end_time: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  max_participants: number;
  current_participants: number;
  points_reward: number;
  hours_reward: number;
  status: 'open' | 'closed' | 'completed';
  image_url?: string;
  created_at: string;
};

export type Participation = {
  id: number;
  user_id: string;
  activity_id: number;
  status: 'registered' | 'completed' | 'cancelled';
  registered_at: string;
  completed_at?: string;
  points_earned?: number;
  hours_earned?: number;
  review?: string;
  rating?: number;
};

export type Recommendation = {
  id: number;
  user_id: string;
  activity_id: number;
  match_score: number;
  reason: string;
  recommended_at: string;
  clicked: boolean;
  applied: boolean;
};

export type MentoringMatch = {
  id: number;
  mentor_id: string;
  mentee_id: string;
  status: 'proposed' | 'accepted' | 'active' | 'completed';
  match_score: number;
  matched_reason: string;
  created_at: string;
};
