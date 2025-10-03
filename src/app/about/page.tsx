'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AboutPage() {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

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
      console.error('Error loading profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            🌲 산림복지 시민정원사
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/about" className="text-primary font-semibold">
              소개
            </Link>
            <Link href="/activities" className="text-gray-700 hover:text-primary transition">
              활동
            </Link>
            {nickname && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary transition">
                  대시보드
                </Link>
                <Link href="/community" className="text-gray-700 hover:text-primary transition">
                  커뮤니티
                </Link>
                <span className="text-gray-700">
                  👋 <span className="font-semibold">{nickname}</span>님
                </span>
              </>
            )}
            {!nickname && (
              <Link
                href="/auth/login"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary mb-4">
            🌲 산림복지 시민정원사
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI 기반 맞춤 산림 활동 추천 플랫폼
          </p>
          <p className="text-sm text-gray-500">
            2025년 산림복지 국민소통 혁신 아이디어 출품작
          </p>
        </section>

        {/* Project Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📖 프로젝트 소개</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold text-primary mb-4">🎯 프로젝트 목적</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              산림복지 서비스에 대한 낮은 인지도와 복잡한 신청 절차로 인해 많은 시민들이 혜택을 받지 못하고 있습니다.
              본 프로젝트는 <strong>AI 기술</strong>을 활용하여 개인 맞춤형 산림복지 프로그램을 추천하고,
              직관적인 UI/UX로 참여 장벽을 낮추는 것을 목표로 합니다.
            </p>

            <h3 className="text-2xl font-semibold text-primary mb-4">💡 핵심 가치</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="font-semibold text-gray-800">AI 기반 개인화</h4>
                  <p className="text-gray-600 text-sm">Claude AI를 활용한 맞춤형 활동 추천</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h4 className="font-semibold text-gray-800">직관적 검색</h4>
                  <p className="text-gray-600 text-sm">지도 기반 위치별 활동 탐색</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold text-gray-800">참여 동기 부여</h4>
                  <p className="text-gray-600 text-sm">등급 시스템과 성취도 추적</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-semibold text-gray-800">커뮤니티</h4>
                  <p className="text-gray-600 text-sm">참여자 간 경험 공유 및 소통</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <h4 className="font-semibold text-gray-800">실시간 알림</h4>
                  <p className="text-gray-600 text-sm">활동 일정 및 중요 정보 알림</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implemented Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">✅ 구현 완료 기능</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                🔐 사용자 인증 및 프로필
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>회원가입 / 로그인</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>이메일 인증 시스템</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>온보딩 프로세스</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>사용자 프로필 관리</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                🎯 활동 탐색 및 추천
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>활동 목록 조회 및 필터</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI 기반 맞춤 활동 추천</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>지도 기반 활동 위치 표시</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>카테고리별 마커 시각화</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                📊 대시보드 및 참여 관리
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>개인 대시보드</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>활동 신청 및 취소</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>등급 시스템 (새싹→나무→숲지키미)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>참여 시간 누적 추적</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                💬 커뮤니티 & 알림
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>활동 후기 게시판</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>사진 공유 기능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>실시간 알림 시스템</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>D-day 알림</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🔄 구현 예정 기능</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary mb-3">Phase 2 (중기 계획)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📊 대시보드 시각화</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 통계 그래프</li>
                    <li>• 참여도 차트</li>
                    <li>• 뱃지 시스템</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📱 소셜 기능</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 친구 추가</li>
                    <li>• 그룹 활동</li>
                    <li>• 리뷰 평점</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">👨‍🏫 멘토링</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 1:1 채팅</li>
                    <li>• 일정 관리</li>
                    <li>• 멘토링 후기</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-primary mb-3">Phase 3 (장기 계획)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">♿ 접근성</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 다크모드</li>
                    <li>• 폰트 크기 조절</li>
                    <li>• 스크린 리더</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📱 모바일 앱</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PWA 변환</li>
                    <li>• 푸시 알림</li>
                    <li>• 오프라인 지원</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🛠️ 관리자</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 활동 관리</li>
                    <li>• 통계 분석</li>
                    <li>• 문의 관리</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🛠 기술 스택</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-3">Frontend</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Next.js 14</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Kakao Map</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-3">Backend</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Supabase</li>
                  <li>• PostgreSQL</li>
                  <li>• Supabase Auth</li>
                  <li>• RLS 정책</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-3">AI & APIs</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Claude 3.5 Sonnet</li>
                  <li>• Anthropic API</li>
                  <li>• 맞춤 추천</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-3">DevOps</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Vercel</li>
                  <li>• GitHub</li>
                  <li>• 자동 배포</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Key Achievements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📈 주요 성과</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-800 mb-2">AI 추천 정확도</h3>
              <p className="text-sm text-gray-600">사용자 선호도 기반 맞춤형 활동 제안</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">직관적 UX</h3>
              <p className="text-sm text-gray-600">3단계 온보딩으로 빠른 서비스 시작</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="font-semibold text-gray-800 mb-2">지도 시각화</h3>
              <p className="text-sm text-gray-600">위치 기반 활동 검색으로 접근성 향상</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">지금 시작해보세요!</h2>
          <p className="text-lg mb-8">AI가 추천하는 나만의 산림 활동을 경험해보세요</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              회원가입
            </Link>
            <Link
              href="/activities"
              className="bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition"
            >
              활동 둘러보기
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">🌲 산림복지 시민정원사</p>
          <p className="text-sm text-gray-400">
            2025년 산림복지 국민소통 혁신 아이디어 출품작
          </p>
          <p className="text-xs text-gray-500 mt-4">
            🤖 Generated with Claude Code
          </p>
        </div>
      </footer>
    </div>
  );
}
