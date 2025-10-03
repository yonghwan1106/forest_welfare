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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header with user info */}
      {!loading && (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-green-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <Link href="/" className="text-2xl sm:text-3xl font-bold text-primary block hover:scale-105 transition-transform">
                🌲 산림복지 시민정원사
              </Link>
              <p className="text-xs text-gray-500 mt-1">2025년 산림복지 국민소통 혁신 아이디어 출품작</p>
            </div>
            <nav className="flex flex-wrap gap-3 sm:gap-6 items-center justify-center">
              <Link href="/about" className="text-gray-700 hover:text-primary font-medium transition-all hover:scale-105">
                소개
              </Link>
              <Link href="/activities" className="text-gray-700 hover:text-primary font-medium transition-all hover:scale-105">
                활동
              </Link>
              {user && nickname ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary font-medium transition-all hover:scale-105">
                    대시보드
                  </Link>
                  <Link href="/community" className="text-gray-700 hover:text-primary font-medium transition-all hover:scale-105">
                    커뮤니티
                  </Link>
                  <Link href="/my/profile" className="text-primary hover:text-green-700 font-semibold transition-all hover:scale-105 bg-green-50 px-3 py-1.5 rounded-full">
                    👋 {nickname}님
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700 font-medium transition-all hover:scale-105"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-primary font-medium transition-all hover:scale-105"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary text-white px-5 py-2 rounded-full hover:bg-green-700 transition-all hover:scale-105 hover:shadow-lg font-medium"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full text-sm font-medium text-green-700">
            🌿 AI 기반 산림복지 플랫폼
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-6 leading-tight">
            🌲 산림복지 시민정원사
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-4 font-light">
            AI가 추천하는 나만의 산림 활동
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            당신의 관심사와 라이프스타일에 맞춘 맞춤형 산림 활동을 경험하세요
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 my-12 max-w-5xl mx-auto w-full">
          <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-green-100 group">
            <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              AI 맞춤 추천
            </h3>
            <p className="text-gray-600 leading-relaxed">
              당신의 관심사와 일정에 맞는 활동을 AI가 추천해드립니다
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-green-100 group">
            <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform">🌱</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              성장 시스템
            </h3>
            <p className="text-gray-600 leading-relaxed">
              참여할수록 등급이 올라가고 더 많은 혜택을 받아요
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-green-100 group sm:col-span-2 lg:col-span-1">
            <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              세대간 멘토링
            </h3>
            <p className="text-gray-600 leading-relaxed">
              경험을 나누고 함께 성장하는 커뮤니티
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 sm:gap-6 justify-center flex-wrap mt-8">
          {user && nickname ? (
            <>
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all hover:scale-105 hover:from-green-700 hover:to-emerald-700"
              >
                대시보드로 가기 →
              </Link>
              <Link
                href="/activities"
                className="bg-white text-green-600 border-2 border-green-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-all hover:scale-105 hover:shadow-lg"
              >
                활동 둘러보기
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all hover:scale-105 hover:from-green-700 hover:to-emerald-700"
              >
                시작하기 →
              </Link>
              <Link
                href="/about"
                className="bg-white text-green-600 border-2 border-green-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-all hover:scale-105 hover:shadow-lg"
              >
                프로젝트 소개
              </Link>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-16 sm:mt-20">
          <div className="text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-xs sm:text-sm text-gray-600">활동 프로그램</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">5000+</div>
            <div className="text-xs sm:text-sm text-gray-600">참여 회원</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-xs sm:text-sm text-gray-600">만족도</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-green-100 py-6 sm:py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            2025년 산림복지 국민소통 혁신 아이디어 출품작
          </p>
          <p className="text-xs text-gray-500">
            © 2025 산림복지 시민정원사. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
