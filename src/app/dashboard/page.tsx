'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { UserProfile, Activity, Recommendation } from '@/types/database';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<
    (Recommendation & { activity: Activity })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If profile doesn't exist or is incomplete, redirect to onboarding
      if (profileError || !profileData || !profileData.nickname) {
        router.push('/onboarding');
        return;
      }

      setProfile(profileData);

      // Load recommendations
      const { data: recommendationsData } = await supabase
        .from('recommendations')
        .select('*, activities(*)')
        .eq('user_id', user.id)
        .order('match_score', { ascending: false })
        .limit(3);

      if (recommendationsData) {
        setRecommendations(
          recommendationsData.map((rec: any) => ({
            ...rec,
            activity: rec.activities,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeInfo = (grade: string) => {
    switch (grade) {
      case 'sprout':
        return {
          emoji: '🌱',
          name: '새싹',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          nextHours: 10,
        };
      case 'tree':
        return {
          emoji: '🌳',
          name: '나무',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          nextHours: 30,
        };
      case 'forest_keeper':
        return {
          emoji: '🌲',
          name: '숲지키미',
          color: 'text-green-800',
          bgColor: 'bg-green-200',
          nextHours: null,
        };
      default:
        return {
          emoji: '🌱',
          name: '새싹',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          nextHours: 10,
        };
    }
  };


  const generateRecommendations = async () => {
    if (!profile) return;

    setGeneratingRecommendations(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: profile.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();

      // Reload recommendations
      const { data: recommendationsData } = await supabase
        .from('recommendations')
        .select('*, activities(*)')
        .eq('user_id', profile.id)
        .order('match_score', { ascending: false })
        .limit(3);

      if (recommendationsData) {
        setRecommendations(
          recommendationsData.map((rec: any) => ({
            ...rec,
            activity: rec.activities,
          }))
        );
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('AI 추천 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!profile) return null;

  const gradeInfo = getGradeInfo(profile.current_grade);
  const progressPercent = gradeInfo.nextHours
    ? (profile.total_hours / gradeInfo.nextHours) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">대시보드</h1>
          <NotificationBell />
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            {profile.nickname}님의 활동 현황
          </h2>
        </div>

        {/* Grade Card */}
        <div className={`${gradeInfo.bgColor} rounded-lg p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-4xl">{gradeInfo.emoji}</span>
                <span className={`text-2xl font-bold ${gradeInfo.color}`}>
                  {gradeInfo.name}
                </span>
              </div>
              <p className="text-gray-700">
                누적 참여 시간: {profile.total_hours}시간 | 포인트:{' '}
                {profile.total_points}점
              </p>
            </div>
            <div className="text-right">
              {gradeInfo.nextHours && (
                <p className="text-sm text-gray-600">
                  다음 등급까지 {gradeInfo.nextHours - profile.total_hours}
                  시간 남음
                </p>
              )}
            </div>
          </div>
          {gradeInfo.nextHours && (
            <div className="mt-4">
              <div className="w-full bg-white rounded-full h-3">
                <div
                  className="bg-primary rounded-full h-3 transition-all"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-primary">
              🎯 {profile.nickname}님을 위한 추천 활동
            </h3>
            <button
              onClick={generateRecommendations}
              disabled={generatingRecommendations}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {generatingRecommendations ? 'AI 분석 중...' : '새로 추천받기'}
            </button>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-primary">
                        매칭도 {rec.match_score}%
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          rec.activity.category === 'healing'
                            ? 'bg-blue-100 text-blue-800'
                            : rec.activity.category === 'education'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {rec.activity.category === 'healing'
                          ? '산림치유'
                          : rec.activity.category === 'education'
                            ? '생태교육'
                            : '봉사활동'}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">
                      {rec.activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {rec.activity.location_sido}{' '}
                      {rec.activity.location_sigungu}
                    </p>
                    <p className="text-sm text-gray-600">
                      📅 {rec.activity.date} {rec.activity.start_time}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <p className="text-sm text-gray-700">{rec.reason}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/activities/${rec.activity.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-200 transition"
                    >
                      자세히 보기
                    </Link>
                    <Link
                      href={`/activities/${rec.activity.id}`}
                      className="flex-1 bg-primary text-white py-2 rounded-lg text-center hover:bg-opacity-90 transition"
                    >
                      신청하기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                아직 AI 추천이 없습니다. 위의 &apos;새로 추천받기&apos; 버튼을 클릭하세요
              </p>
              <button
                onClick={generateRecommendations}
                disabled={generatingRecommendations}
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 mr-4"
              >
                {generatingRecommendations ? 'AI 분석 중...' : 'AI 추천 받기'}
              </button>
              <Link
                href="/activities"
                className="inline-block bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                활동 둘러보기
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/activities"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <h4 className="font-bold text-lg mb-2">📋 모든 활동 보기</h4>
            <p className="text-gray-600">
              지역별, 카테고리별로 활동을 탐색하세요
            </p>
          </Link>
          <Link
            href="/my/participations"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <h4 className="font-bold text-lg mb-2">✅ 내 참여 내역</h4>
            <p className="text-gray-600">신청한 활동과 참여 기록을 확인하세요</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
