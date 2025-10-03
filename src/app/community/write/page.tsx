'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function CommunityWritePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [type, setType] = useState<string>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activityId, setActivityId] = useState<string>('');
  const [activities, setActivities] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUserAndActivities();
  }, []);

  const loadUserAndActivities = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setUserId(user.id);

    // Load user's completed activities for review
    const { data: participations } = await supabase
      .from('participations')
      .select('activity_id, activities (id, title)')
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (participations) {
      const activitiesList = participations
        .map((p: any) => p.activities)
        .filter(Boolean);
      setActivities(activitiesList);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const postData: any = {
        user_id: userId,
        type,
        title: title.trim(),
        content: content.trim(),
      };

      if (type === 'review' && activityId) {
        postData.activity_id = parseInt(activityId);
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      alert('게시글이 작성되었습니다!');
      router.push('/community');
    } catch (error: any) {
      console.error('Error creating post:', error);
      alert(error.message || '게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">글쓰기</h1>
          <Link
            href="/community"
            className="text-gray-700 hover:text-primary transition"
          >
            ← 목록으로
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              게시글 유형
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="general">자유</option>
              <option value="review">활동 후기</option>
              <option value="qna">Q&A</option>
              <option value="story">경험 공유</option>
            </select>
          </div>

          {/* Activity Selection (for review) */}
          {type === 'review' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동 선택
              </label>
              <select
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required={type === 'review'}
              >
                <option value="">활동을 선택하세요</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? '작성 중...' : '작성하기'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              취소
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
