'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Get user profile
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
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNickname(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header with user info */}
      {!loading && (
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <Link href="/" className="text-2xl font-bold text-primary block">
                🌲 산림복지 시민정원사
              </Link>
              <p className="text-xs text-gray-500 mt-1">산림복지 국민소통 혁신 아이디어</p>
            </div>
            <nav className="flex gap-6 items-center">
              <Link href="/about" className="text-gray-700 hover:text-primary transition">
                소개
              </Link>
              <Link href="/activities" className="text-gray-700 hover:text-primary transition">
                활동
              </Link>
              {user && nickname ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary transition">
                    대시보드
                  </Link>
                  <Link href="/community" className="text-gray-700 hover:text-primary transition">
                    커뮤니티
                  </Link>
                  <Link href="/my/profile" className="text-gray-700 hover:text-primary transition">
                    👋 <span className="font-semibold">{nickname}</span>님
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-primary transition"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-primary mb-6">
          🌲 산림복지 시민정원사
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          AI가 추천하는 나만의 산림 활동
        </p>

        <div className="grid md:grid-cols-3 gap-8 my-12 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 text-primary">AI 맞춤 추천</h3>
            <p className="text-gray-600">당신의 관심사와 일정에 맞는 활동을 AI가 추천해드립니다</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold mb-2 text-primary">성장 시스템</h3>
            <p className="text-gray-600">참여할수록 등급이 올라가고 더 많은 혜택을 받아요</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2 text-primary">세대간 멘토링</h3>
            <p className="text-gray-600">경험을 나누고 함께 성장하는 커뮤니티</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {user && nickname ? (
            <>
              <Link
                href="/dashboard"
                className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
              >
                대시보드로 가기
              </Link>
              <Link
                href="/activities"
                className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
              >
                활동 둘러보기
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
              >
                시작하기
              </Link>
              <Link
                href="/about"
                className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
              >
                프로젝트 소개
              </Link>
            </>
          )}
        </div>

        {/* Contest Info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            2025년 산림복지 국민소통 혁신 아이디어 출품작
          </p>
        </div>
      </main>
    </div>
  );
}
