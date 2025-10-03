'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';

interface CommunityPost {
  id: number;
  user_id: string;
  activity_id?: number;
  type: string;
  title: string;
  content: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  user_profiles: {
    nickname: string;
  };
  activities?: {
    title: string;
  };
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
    loadUserProfile();
  }, [typeFilter]);

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

  const loadPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          user_profiles (nickname),
          activities (title)
        `)
        .order('created_at', { ascending: false });

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'review':
        return '활동 후기';
      case 'qna':
        return 'Q&A';
      case 'story':
        return '경험 공유';
      case 'general':
        return '자유';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-green-100 text-green-800';
      case 'qna':
        return 'bg-blue-100 text-blue-800';
      case 'story':
        return 'bg-purple-100 text-purple-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString('ko-KR');
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
              href="/activities"
              className="text-gray-700 hover:text-primary transition"
            >
              활동 목록
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">커뮤니티</h1>
          <Link
            href="/community/write"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition"
          >
            ✍️ 글쓰기
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                typeFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setTypeFilter('review')}
              className={`px-4 py-2 rounded-lg transition ${
                typeFilter === 'review'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              활동 후기
            </button>
            <button
              onClick={() => setTypeFilter('qna')}
              className={`px-4 py-2 rounded-lg transition ${
                typeFilter === 'qna'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Q&A
            </button>
            <button
              onClick={() => setTypeFilter('story')}
              className={`px-4 py-2 rounded-lg transition ${
                typeFilter === 'story'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              경험 공유
            </button>
            <button
              onClick={() => setTypeFilter('general')}
              className={`px-4 py-2 rounded-lg transition ${
                typeFilter === 'general'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              자유
            </button>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                        post.type
                      )}`}
                    >
                      {getTypeLabel(post.type)}
                    </span>
                    {post.activities && (
                      <span className="text-sm text-gray-500">
                        활동: {post.activities.title}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatTimeAgo(post.created_at)}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-2 line-clamp-1">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>👤</span>
                    <span>{post.user_profiles.nickname}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>❤️</span>
                    <span>{post.likes_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{post.comments_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👁️</span>
                    <span>{post.views_count}</span>
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
