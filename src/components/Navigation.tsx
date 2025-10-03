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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          🌲 산림복지 시민정원사
        </Link>
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
              <Link href="/my/participations" className="text-gray-700 hover:text-primary transition">
                내 활동
              </Link>
              <span className="text-gray-700">
                👋 <span className="font-semibold">{nickname}</span>님
              </span>
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
  );
}
