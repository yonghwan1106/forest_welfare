'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    checkUser();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setNickname(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user);
      loadUserProfile(user.id);
    }
  };

  const loadUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nickname')
      .eq('id', userId)
      .single();

    if (profile) {
      setNickname(profile.nickname);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNickname(null);
    router.push('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center sm:items-start">
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-primary hover:scale-105 transition-transform">
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
              <Link href="/my/participations" className="text-gray-700 hover:text-primary font-medium transition-all hover:scale-105">
                내 활동
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
  );
}
