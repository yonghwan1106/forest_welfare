'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import NotificationBell from '@/components/NotificationBell';

interface UserProfile {
  id: string;
  nickname: string;
  birth_date: string | null;
  age_group: string | null;
  region_sido: string | null;
  region_sigungu: string | null;
  interests: string[];
  available_times: string[];
  participation_frequency: string | null;
  experience_level: string | null;
  current_grade: string;
  total_hours: number;
  total_points: number;
  profile_image_url: string | null;
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
  const [birthDate, setBirthDate] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [regionSido, setRegionSido] = useState('');
  const [regionSigungu, setRegionSigungu] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [participationFrequency, setParticipationFrequency] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

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
      setBirthDate(profileData.birth_date || '');
      setAgeGroup(profileData.age_group || '');
      setRegionSido(profileData.region_sido || '');
      setRegionSigungu(profileData.region_sigungu || '');
      setInterests(profileData.interests || []);
      setAvailableTimes(profileData.available_times || []);
      setParticipationFrequency(profileData.participation_frequency || '');
      setExperienceLevel(profileData.experience_level || '');
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
          birth_date: birthDate || null,
          age_group: ageGroup || null,
          region_sido: regionSido || null,
          region_sigungu: regionSigungu || null,
          interests,
          available_times: availableTimes,
          participation_frequency: participationFrequency || null,
          experience_level: experienceLevel || null,
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
      setBirthDate(profile.birth_date || '');
      setAgeGroup(profile.age_group || '');
      setRegionSido(profile.region_sido || '');
      setRegionSigungu(profile.region_sigungu || '');
      setInterests(profile.interests || []);
      setAvailableTimes(profile.available_times || []);
      setParticipationFrequency(profile.participation_frequency || '');
      setExperienceLevel(profile.experience_level || '');
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

  const toggleAvailableTime = (time: string) => {
    setAvailableTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
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

            {/* Age Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연령대
              </label>
              {editing ? (
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option value="20s">20대</option>
                  <option value="30s">30대</option>
                  <option value="40s">40대</option>
                  <option value="50s">50대</option>
                  <option value="60s">60대</option>
                  <option value="70s+">70대 이상</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {profile.age_group === '20s' ? '20대'
                    : profile.age_group === '30s' ? '30대'
                    : profile.age_group === '40s' ? '40대'
                    : profile.age_group === '50s' ? '50대'
                    : profile.age_group === '60s' ? '60대'
                    : profile.age_group === '70s+' ? '70대 이상'
                    : '-'}
                </p>
              )}
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역
              </label>
              {editing ? (
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={regionSido}
                    onChange={(e) => setRegionSido(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">시/도 선택</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="경기도">경기도</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="강원특별자치도">강원특별자치도</option>
                  </select>
                  <input
                    type="text"
                    value={regionSigungu}
                    onChange={(e) => setRegionSigungu(e.target.value)}
                    placeholder="시/군/구"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ) : (
                <p className="text-gray-900">
                  {profile.region_sido && profile.region_sigungu
                    ? `${profile.region_sido} ${profile.region_sigungu}`
                    : profile.region_sido || '-'}
                </p>
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

            {/* Available Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동 가능 시간
              </label>
              {editing ? (
                <div className="flex gap-2 flex-wrap">
                  {['평일 오전', '평일 오후', '주말 오전', '주말 오후'].map(
                    (time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => toggleAvailableTime(time)}
                        className={`px-4 py-2 rounded-lg border transition ${
                          availableTimes.includes(time)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-900">
                  {profile.available_times && profile.available_times.length > 0
                    ? profile.available_times.join(', ')
                    : '-'}
                </p>
              )}
            </div>

            {/* Participation Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참여 빈도
              </label>
              {editing ? (
                <select
                  value={participationFrequency}
                  onChange={(e) => setParticipationFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option value="주 1회">주 1회</option>
                  <option value="주 2-3회">주 2-3회</option>
                  <option value="월 1-2회">월 1-2회</option>
                  <option value="분기별">분기별</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {profile.participation_frequency || '-'}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                경험 수준
              </label>
              {editing ? (
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option value="초보">초보</option>
                  <option value="중급">중급</option>
                  <option value="고급">고급</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.experience_level || '-'}</p>
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
