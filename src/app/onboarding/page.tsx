'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type OnboardingStep = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Step 1: 기본 정보
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [regionSido, setRegionSido] = useState('');
  const [regionSigungu, setRegionSigungu] = useState('');

  // Step 2: 관심사
  const [interests, setInterests] = useState<string[]>([]);

  // Step 3: 가용 시간
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [participationFrequency, setParticipationFrequency] = useState('');

  // Step 4: 경험 수준
  const [experienceLevel, setExperienceLevel] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUserId(user.id);
      }
    };
    checkUser();
  }, [router]);

  const calculateAgeGroup = (year: string) => {
    const birthYear = parseInt(year);
    const age = new Date().getFullYear() - birthYear;
    if (age < 30) return '20s';
    if (age < 40) return '30s';
    if (age < 50) return '40s';
    if (age < 60) return '50s';
    if (age < 70) return '60s';
    return '70s+';
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

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const handleComplete = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
      const ageGroup = calculateAgeGroup(birthYear);

      // Insert or update user profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          nickname,
          birth_date: birthDate,
          age_group: ageGroup,
          region_sido: regionSido,
          region_sigungu: regionSigungu,
          interests,
          available_times: availableTimes,
          participation_frequency: participationFrequency,
          experience_level: experienceLevel,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{step}/4 단계</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary mb-4">
                반갑습니다! 🌿
              </h2>
              <p className="text-gray-600 mb-6">
                맞춤 활동 추천을 위해 몇 가지 알려주세요
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="사용하실 닉네임을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1990"
                  />
                  <input
                    type="number"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="06"
                    min="1"
                    max="12"
                  />
                  <input
                    type="number"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="15"
                    min="1"
                    max="31"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거주 지역
                </label>
                <div className="flex gap-2">
                  <select
                    value={regionSido}
                    onChange={(e) => setRegionSido(e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">시/도 선택</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="경기도">경기도</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="강원특별자치도">강원특별자치도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="대전광역시">대전광역시</option>
                    <option value="세종특별자치시">세종특별자치시</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="부산광역시">부산광역시</option>
                    <option value="울산광역시">울산광역시</option>
                    <option value="대구광역시">대구광역시</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="광주광역시">광주광역시</option>
                    <option value="제주특별자치도">제주특별자치도</option>
                  </select>
                  <input
                    type="text"
                    value={regionSigungu}
                    onChange={(e) => setRegionSigungu(e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="시/군/구"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={
                  !nickname ||
                  !birthYear ||
                  !birthMonth ||
                  !birthDay ||
                  !regionSido ||
                  !regionSigungu
                }
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                다음 →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary mb-4">
                관심사 선택
              </h2>
              <p className="text-gray-600 mb-6">
                어떤 활동에 관심이 있으신가요? (복수 선택 가능)
              </p>

              <div className="space-y-4">
                {[
                  {
                    id: 'healing',
                    icon: '🧘',
                    title: '산림치유',
                    desc: '스트레스 해소, 명상, 힐링 산책',
                  },
                  {
                    id: 'education',
                    icon: '🌱',
                    title: '생태교육',
                    desc: '자연 학습, 식물 관찰, 환경보호',
                  },
                  {
                    id: 'volunteer',
                    icon: '🤝',
                    title: '봉사활동',
                    desc: '숲길 정비, 쓰레기 수거, 안내 도우미',
                  },
                  {
                    id: 'mentoring',
                    icon: '👨‍🏫',
                    title: '멘토링',
                    desc: '지식 전달, 청소년 지도',
                  },
                ].map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition ${
                      interests.includes(interest.id)
                        ? 'border-primary bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="text-3xl mr-4">{interest.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{interest.title}</h3>
                        <p className="text-gray-600 text-sm">{interest.desc}</p>
                      </div>
                      {interests.includes(interest.id) && (
                        <span className="ml-auto text-primary text-2xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="w-1/3 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ← 이전
                </button>
                <button
                  onClick={handleNext}
                  disabled={interests.length === 0}
                  className="w-2/3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  다음 →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary mb-4">
                가용 시간
              </h2>
              <p className="text-gray-600 mb-6">언제 참여 가능하신가요?</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  요일 (복수 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'weekday_morning', label: '평일 오전' },
                    { id: 'weekday_afternoon', label: '평일 오후' },
                    { id: 'weekend_morning', label: '주말 오전' },
                    { id: 'weekend_afternoon', label: '주말 오후' },
                  ].map((time) => (
                    <button
                      key={time.id}
                      onClick={() => toggleAvailableTime(time.id)}
                      className={`p-3 border-2 rounded-lg font-medium transition ${
                        availableTimes.includes(time.id)
                          ? 'border-primary bg-green-50 text-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {availableTimes.includes(time.id) && '✓ '}
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  월 참여 가능 횟수
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'monthly', label: '월 1-2회' },
                    { id: 'biweekly', label: '격주 1회 (월 2-3회)' },
                    { id: 'weekly', label: '주 1회 이상' },
                    { id: 'occasionally', label: '비정기적' },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() => setParticipationFrequency(freq.id)}
                      className={`w-full p-3 border-2 rounded-lg font-medium text-left transition ${
                        participationFrequency === freq.id
                          ? 'border-primary bg-green-50 text-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {participationFrequency === freq.id && '⦿ '}
                      {participationFrequency !== freq.id && '○ '}
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="w-1/3 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ← 이전
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    availableTimes.length === 0 || !participationFrequency
                  }
                  className="w-2/3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  다음 →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary mb-4">
                경험 수준
              </h2>
              <p className="text-gray-600 mb-6">
                산림복지 활동 경험이 있으신가요?
              </p>

              <div className="space-y-3">
                {[
                  { id: 'beginner', label: '경험 없음 (처음이에요)' },
                  { id: 'intermediate', label: '몇 번 참여해봤어요' },
                  { id: 'advanced', label: '전문가 (관련 직업/자격증 보유)' },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceLevel(level.id)}
                    className={`w-full p-4 border-2 rounded-lg font-medium text-left transition ${
                      experienceLevel === level.id
                        ? 'border-primary bg-green-50 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {experienceLevel === level.id && '⦿ '}
                    {experienceLevel !== level.id && '○ '}
                    {level.label}
                  </button>
                ))}
              </div>

              {experienceLevel === 'advanced' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 전문가 회원님은 멘토 활동에 우선 초대해드립니다!
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="w-1/3 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ← 이전
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!experienceLevel || loading}
                  className="w-2/3 bg-accent text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  {loading ? '처리중...' : '완료! 🎉'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
