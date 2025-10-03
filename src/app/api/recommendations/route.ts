import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Initialize Supabase client only if environment variables are set
let supabase: any = null;
if (
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 사용자 프로필 가져오기
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // 활동 목록 가져오기
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('status', 'open')
      .order('date', { ascending: true });

    if (activitiesError) {
      throw activitiesError;
    }

    // Claude API를 사용한 추천
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `다음 사용자 정보를 기반으로 가장 적합한 산림복지 활동 3개를 추천해주세요.

사용자 정보:
- 연령대: ${userProfile.age_group}
- 지역: ${userProfile.region_sido} ${userProfile.region_sigungu}
- 관심사: ${userProfile.interests.join(', ')}
- 가능한 시간대: ${userProfile.available_times.join(', ')}
- 참여 빈도: ${userProfile.participation_frequency}
- 경험 수준: ${userProfile.experience_level}
- 현재 등급: ${userProfile.current_grade}

활동 목록:
${JSON.stringify(activities, null, 2)}

다음 형식의 JSON으로만 응답해주세요:
{
  "recommendations": [
    {
      "activity_id": 숫자,
      "match_score": 0-100 사이의 숫자,
      "reason": "추천 이유를 한 문장으로"
    }
  ]
}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // JSON 파싱
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Claude');
    }

    const recommendations = JSON.parse(jsonMatch[0]);

    // 추천 결과를 데이터베이스에 저장
    const recommendationsToInsert = recommendations.recommendations.map(
      (rec: any) => ({
        user_id: userId,
        activity_id: rec.activity_id,
        match_score: rec.match_score,
        reason: rec.reason,
        recommended_at: new Date().toISOString(),
        clicked: false,
        applied: false,
      })
    );

    const { error: insertError } = await supabase
      .from('recommendations')
      .insert(recommendationsToInsert);

    if (insertError) {
      console.error('Error saving recommendations:', insertError);
    }

    return NextResponse.json({
      recommendations: recommendations.recommendations,
    });
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
