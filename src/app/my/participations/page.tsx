'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Participation, Activity } from '@/types/database';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import Navigation from '@/components/Navigation';

type ParticipationWithActivity = Participation & {
  activity: Activity;
};

export default function ParticipationsPage() {
  const router = useRouter();
  const [participations, setParticipations] = useState<
    ParticipationWithActivity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadParticipations();
  }, []);

  const loadParticipations = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('participations')
        .select('*, activities(*)')
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false });

      if (error) throw error;

      setParticipations(
        data.map((p: any) => ({ ...p, activity: p.activities }))
      );
    } catch (error) {
      console.error('Error loading participations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelParticipation = async (participationId: number) => {
    if (!confirm('정말 신청을 취소하시겠습니까?')) return;

    try {
      // Update participation status
      const { error: updateError } = await supabase
        .from('participations')
        .update({ status: 'cancelled' })
        .eq('id', participationId);

      if (updateError) throw updateError;

      // Reload participations
      await loadParticipations();
    } catch (error) {
      console.error('Error cancelling participation:', error);
      alert('취소 중 오류가 발생했습니다.');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'registered':
        return { text: '신청완료', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { text: '참여완료', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: '취소됨', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' };
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

  const filteredParticipations = participations.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">내 참여 활동</h1>
          <NotificationBell />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('registered')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'registered'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            신청완료
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            참여완료
          </button>
        </div>

        {/* Participations List */}
        {filteredParticipations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">참여 내역이 없습니다</p>
            <Link
              href="/activities"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              활동 찾아보기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredParticipations.map((participation) => {
              const statusInfo = getStatusLabel(participation.status);
              const isPast = new Date(participation.activity.date) < new Date();

              return (
                <div
                  key={participation.id}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.text}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            participation.activity.category === 'healing'
                              ? 'bg-blue-100 text-blue-800'
                              : participation.activity.category === 'education'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {getCategoryLabel(participation.activity.category)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2">
                        {participation.activity.title}
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                          <p className="mb-1">
                            📍 {participation.activity.location_sido}{' '}
                            {participation.activity.location_sigungu}
                          </p>
                          <p className="mb-1">
                            📅 {participation.activity.date}{' '}
                            {participation.activity.start_time}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1">
                            🎁 {participation.activity.hours_reward}시간 /{' '}
                            {participation.activity.points_reward}포인트
                          </p>
                          <p className="text-sm text-gray-500">
                            신청일:{' '}
                            {new Date(
                              participation.registered_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {participation.status === 'completed' &&
                        participation.review && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                              💬 {participation.review}
                            </p>
                            {participation.rating && (
                              <p className="text-sm text-yellow-600 mt-1">
                                ⭐ {participation.rating}/5
                              </p>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <Link
                        href={`/activities/${participation.activity.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
                      >
                        상세보기
                      </Link>

                      {participation.status === 'registered' && !isPast && (
                        <button
                          onClick={() =>
                            handleCancelParticipation(participation.id)
                          }
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"
                        >
                          취소하기
                        </button>
                      )}

                      {participation.status === 'completed' &&
                        !participation.review && (
                          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90 transition">
                            후기 작성
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
