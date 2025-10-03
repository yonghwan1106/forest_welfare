'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import NotificationBell from '@/components/NotificationBell';

interface UserProfile {
  id: string;
  nickname: string;
  full_name: string | null;
  birth_date: string | null;
  phone: string | null;
  address: string | null;
  interests: string[];
  preferred_regions: string[];
  preferred_days: string[];
  current_grade: string;
  total_hours: number;
  total_points: number;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [nickname, setNickname] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [preferredRegions, setPreferredRegions] = useState<string[]>([]);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(profileData);
      // Initialize form states
      setNickname(profileData.nickname || '');
      setFullName(profileData.full_name || '');
      setBirthDate(profileData.birth_date || '');
      setPhone(profileData.phone || '');
      setAddress(profileData.address || '');
      setInterests(profileData.interests || []);
      setPreferredRegions(profileData.preferred_regions || []);
      setPreferredDays(profileData.preferred_days || []);
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          nickname: nickname.trim(),
          full_name: fullName.trim() || null,
          birth_date: birthDate || null,
          phone: phone.trim() || null,
          address: address.trim() || null,
          interests,
          preferred_regions: preferredRegions,
          preferred_days: preferredDays,
        })
        .eq('id', profile.id);

      if (error) throw error;

      alert('프로필이 업데이트되었습니다.');
      setEditing(false);
      await loadProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setNickname(profile.nickname || '');
      setFullName(profile.full_name || '');
      setBirthDate(profile.birth_date || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setInterests(profile.interests || []);
      setPreferredRegions(profile.preferred_regions || []);
      setPreferredDays(profile.preferred_days || []);
    }
    setEditing(false);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleRegion = (region: string) => {
    setPreferredRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const toggleDay = (day: string) => {
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getGradeInfo = (grade: string) => {
    switch (grade) {
      case 'sprout':
        return { emoji: '🌱', name: '새싹', color: 'text-green-600' };
      case 'tree':
        return { emoji: '🌳', name: '나무', color: 'text-green-700' };
      case 'forest_keeper':
        return { emoji: '🌲', name: '숲지키미', color: 'text-green-800' };
      default:
        return { emoji: '🌱', name: '새싹', color: 'text-green-600' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const gradeInfo = getGradeInfo(profile.current_grade);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">내 프로필</h1>
          <NotificationBell />
        </div>

        {/* Grade Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{gradeInfo.emoji}</span>
            <div>
              <h2 className={`text-3xl font-bold ${gradeInfo.color}`}>
                {gradeInfo.name}
              </h2>
              <p className="text-gray-600 mt-1">
                누적 {profile.total_hours}시간 | {profile.total_points}포인트
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">개인정보</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition"
              >
                수정하기
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임 *
              </label>
              {editing ? (
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              ) : (
                <p className="text-gray-900">{profile.nickname}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              {editing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.full_name || '-'}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생년월일
              </label>
              {editing ? (
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.birth_date || '-'}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.phone || '-'}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소
              </label>
              {editing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profile.address || '-'}</p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관심 활동
              </label>
              {editing ? (
                <div className="flex gap-2 flex-wrap">
                  {['healing', 'education', 'volunteer'].map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        interests.includes(interest)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {interest === 'healing'
                        ? '산림치유'
                        : interest === 'education'
                          ? '생태교육'
                          : '봉사활동'}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-900">
                  {profile.interests && profile.interests.length > 0
                    ? profile.interests
                        .map((i) =>
                          i === 'healing'
                            ? '산림치유'
                            : i === 'education'
                              ? '생태교육'
                              : '봉사활동'
                        )
                        .join(', ')
                    : '-'}
                </p>
              )}
            </div>

            {/* Preferred Regions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선호 지역
              </label>
              {editing ? (
                <div className="flex gap-2 flex-wrap">
                  {['서울특별시', '경기도', '인천광역시', '강원특별자치도'].map(
                    (region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className={`px-4 py-2 rounded-lg border transition ${
                          preferredRegions.includes(region)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                      >
                        {region}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-900">
                  {profile.preferred_regions &&
                  profile.preferred_regions.length > 0
                    ? profile.preferred_regions.join(', ')
                    : '-'}
                </p>
              )}
            </div>

            {/* Preferred Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선호 요일
              </label>
              {editing ? (
                <div className="flex gap-2 flex-wrap">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        preferredDays.includes(day)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-900">
                  {profile.preferred_days && profile.preferred_days.length > 0
                    ? profile.preferred_days.join(', ')
                    : '-'}
                </p>
              )}
            </div>

            {/* Account Created */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가입일
              </label>
              <p className="text-gray-900">
                {new Date(profile.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>

          {editing && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장하기'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
