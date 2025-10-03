'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Activity } from '@/types/database';
import Link from 'next/link';
import KakaoMap from '@/components/KakaoMap';

export default function ActivityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    loadActivity();
  }, [activityId]);

  const loadActivity = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      // Load activity
      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (activityError) throw activityError;
      setActivity(activityData);

      // Check if user already applied
      if (user) {
        const { data: participationData } = await supabase
          .from('participations')
          .select('id')
          .eq('user_id', user.id)
          .eq('activity_id', activityId)
          .eq('status', 'registered')
          .single();

        setAlreadyApplied(!!participationData);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    if (!activity) return;

    setApplying(true);

    try {
      // Create participation
      const { error: participationError } = await supabase
        .from('participations')
        .insert([
          {
            user_id: userId,
            activity_id: activity.id,
            status: 'registered',
            registered_at: new Date().toISOString(),
          },
        ]);

      if (participationError) throw participationError;

      // Update activity participant count
      const { error: updateError } = await supabase
        .from('activities')
        .update({
          current_participants: activity.current_participants + 1,
        })
        .eq('id', activity.id);

      if (updateError) throw updateError;

      alert('신청이 완료되었습니다!');
      router.push('/my/participations');
    } catch (error: any) {
      console.error('Error applying:', error);
      alert(error.message || '신청 중 오류가 발생했습니다.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">활동을 찾을 수 없습니다.</div>
      </div>
    );
  }

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
        return '초급 (누구나 가능)';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return difficulty;
    }
  };

  const isFull = activity.current_participants >= activity.max_participants;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            🌲 산림복지 시민정원사
          </Link>
          <Link
            href="/activities"
            className="text-gray-700 hover:text-primary transition"
          >
            ← 목록으로
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Activity Image */}
        <div className="h-96 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-8 flex items-center justify-center">
          <span className="text-9xl">
            {activity.category === 'healing'
              ? '🧘'
              : activity.category === 'education'
                ? '🌱'
                : '🤝'}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Title and Category */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded text-sm font-semibold ${
                  activity.category === 'healing'
                    ? 'bg-blue-100 text-blue-800'
                    : activity.category === 'education'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                }`}
              >
                {getCategoryLabel(activity.category)}
              </span>
              <span className="text-gray-500">
                난이도: {getDifficultyLabel(activity.difficulty)}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
          </div>

          {/* Activity Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-bold mb-3 text-lg">📅 일시</h3>
              <p className="text-gray-700">
                {activity.date}
                <br />
                {activity.start_time} - {activity.end_time}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-lg">📍 장소</h3>
              <p className="text-gray-700">
                {activity.location_sido} {activity.location_sigungu}
                <br />
                {activity.location_detail}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-lg">👥 참여 인원</h3>
              <p className="text-gray-700">
                현재 {activity.current_participants}명 / 최대{' '}
                {activity.max_participants}명
              </p>
              {isFull && (
                <p className="text-red-600 font-semibold mt-1">
                  ⚠️ 정원이 마감되었습니다
                </p>
              )}
            </div>

            <div>
              <h3 className="font-bold mb-3 text-lg">🎁 혜택</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• {activity.hours_reward}시간 인정</li>
                <li>• {activity.points_reward}포인트 적립</li>
              </ul>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-bold mb-3 text-lg">💬 프로그램 소개</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {activity.description}
            </p>
          </div>

          {/* Map */}
          {activity.latitude && activity.longitude && (
            <div className="mb-8">
              <h3 className="font-bold mb-3 text-lg">🗺️ 위치</h3>
              <KakaoMap
                latitude={activity.latitude}
                longitude={activity.longitude}
                markerTitle={activity.title}
              />
            </div>
          )}

          {/* Apply Button */}
          <div className="border-t border-gray-200 pt-6">
            {alreadyApplied ? (
              <div className="bg-green-50 text-green-800 py-4 px-6 rounded-lg text-center font-semibold">
                ✅ 이미 신청한 활동입니다
              </div>
            ) : isFull ? (
              <div className="bg-gray-100 text-gray-600 py-4 px-6 rounded-lg text-center font-semibold">
                정원이 마감되었습니다
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {applying ? '처리중...' : '신청하기 (무료)'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
