'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Activity } from '@/types/database';
import Link from 'next/link';
import ActivityMap from '@/components/ActivityMap';
import NotificationBell from '@/components/NotificationBell';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [nickname, setNickname] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

  useEffect(() => {
    loadActivities();
    loadUserProfile();
  }, [categoryFilter, regionFilter]);

  const loadUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('nickname')
          .eq('id', user.id)
          .single();

        if (profile) {
          setNickname(profile.nickname);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadActivities = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('activities')
        .select('*')
        .eq('status', 'open')
        .order('date', { ascending: true });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (regionFilter !== 'all') {
        query = query.eq('location_sido', regionFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'healing':
        return '산림치유';
      case 'education':
        return '생태교육';
      case 'volunteer':
        return '봉사활동';
      default:
        return category;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            🌲 산림복지 시민정원사
          </Link>
          <div className="flex gap-4 items-center">
            <NotificationBell />
            {nickname && (
              <span className="text-gray-700">
                👋 <span className="font-semibold">{nickname}</span>님
              </span>
            )}
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary transition"
            >
              대시보드
            </Link>
            <Link
              href="/my/participations"
              className="text-gray-700 hover:text-primary transition"
            >
              내 활동
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">활동 목록</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="healing">산림치유</option>
                <option value="education">생태교육</option>
                <option value="volunteer">봉사활동</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="서울특별시">서울특별시</option>
                <option value="경기도">경기도</option>
                <option value="인천광역시">인천광역시</option>
                <option value="강원특별자치도">강원특별자치도</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition"
            >
              {showMap ? '📋 목록 보기' : '🗺️ 지도 보기'}
            </button>
          </div>
        </div>

        {/* Map View */}
        {showMap && !loading && activities.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">활동 위치</h2>
            <ActivityMap
              activities={activities.filter(a => a.latitude && a.longitude) as Array<typeof activities[0] & { latitude: number; longitude: number }>}
              onMarkerClick={(activityId) => {
                window.location.href = `/activities/${activityId}`;
              }}
            />
          </div>
        )}

        {/* Activities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">검색 조건에 맞는 활동이 없습니다.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/activities/${activity.id}`}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-6xl">
                    {activity.category === 'healing'
                      ? '🧘'
                      : activity.category === 'education'
                        ? '🌱'
                        : '🤝'}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        activity.category === 'healing'
                          ? 'bg-blue-100 text-blue-800'
                          : activity.category === 'education'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {getCategoryLabel(activity.category)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getDifficultyLabel(activity.difficulty)}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {activity.title}
                  </h3>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>
                      📍 {activity.location_sido} {activity.location_sigungu}
                    </p>
                    <p>
                      📅 {activity.date} {activity.start_time}
                    </p>
                    <p>
                      👥 {activity.current_participants}/
                      {activity.max_participants}명
                    </p>
                    <p>🎁 {activity.hours_reward}시간 인정</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-primary font-semibold hover:underline">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
