'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface Activity {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  category: string;
  location_sido: string;
  location_sigungu: string;
}

interface ActivityMapProps {
  activities: Activity[];
  centerLat?: number;
  centerLng?: number;
  width?: string;
  height?: string;
  level?: number;
  onMarkerClick?: (activityId: number) => void;
}

export default function ActivityMap({
  activities,
  centerLat = 37.5665,
  centerLng = 126.9780,
  width = '100%',
  height = '500px',
  level = 7,
  onMarkerClick
}: ActivityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          window.kakao.maps.load(() => {
            initializeMap();
          });
        };
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapContainer.current) return;

      const options = {
        center: new window.kakao.maps.LatLng(centerLat, centerLng),
        level: level
      };

      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(kakaoMap);
    };

    loadKakaoMap();
  }, [centerLat, centerLng, level]);

  useEffect(() => {
    if (!map || !activities || activities.length === 0) return;

    // 기존 마커 제거
    // (실제로는 마커를 관리하는 state를 만들어서 제거하는 것이 좋습니다)

    // 카테고리별 색상 및 이모지
    const getCategoryInfo = (category: string) => {
      switch (category) {
        case 'healing':
          return { emoji: '🌲', color: '#10b981' };
        case 'education':
          return { emoji: '📚', color: '#3b82f6' };
        case 'volunteer':
          return { emoji: '❤️', color: '#ef4444' };
        default:
          return { emoji: '📍', color: '#6b7280' };
      }
    };

    // 커스텀 마커 생성 (HTML 오버레이 사용)
    activities.forEach((activity) => {
      if (!activity.latitude || !activity.longitude) return;

      const position = new window.kakao.maps.LatLng(
        activity.latitude,
        activity.longitude
      );

      const categoryInfo = getCategoryInfo(activity.category);

      // 커스텀 오버레이 컨텐츠
      const content = document.createElement('div');
      content.style.cssText = `
        background-color: ${categoryInfo.color};
        border: 2px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `;
      content.innerHTML = categoryInfo.emoji;
      content.title = activity.title;

      // 호버 효과
      content.addEventListener('mouseenter', () => {
        content.style.transform = 'scale(1.2)';
      });
      content.addEventListener('mouseleave', () => {
        content.style.transform = 'scale(1)';
      });

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1
      });

      customOverlay.setMap(map);

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px;min-width:150px;background:white;border-radius:8px;">
            <div style="font-weight:bold;margin-bottom:5px;">${activity.title}</div>
            <div style="font-size:12px;color:#666;">
              ${activity.location_sido} ${activity.location_sigungu}
            </div>
          </div>
        `,
        removable: false
      });

      // 클릭 이벤트
      content.addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(activity.id);
        }
      });

      // 마우스 오버 이벤트 - 인포윈도우 표시
      content.addEventListener('mouseenter', () => {
        infowindow.open(map, customOverlay);
      });

      // 마우스 아웃 이벤트 - 인포윈도우 숨김
      content.addEventListener('mouseleave', () => {
        infowindow.close();
      });
    });

    // 지도 범위 재설정 (모든 마커가 보이도록)
    if (activities.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      activities.forEach((activity) => {
        if (activity.latitude && activity.longitude) {
          bounds.extend(
            new window.kakao.maps.LatLng(activity.latitude, activity.longitude)
          );
        }
      });
      map.setBounds(bounds);
    }
  }, [map, activities, onMarkerClick]);

  return (
    <div>
      <div ref={mapContainer} style={{ width, height }} />
      <div className="mt-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow">
            🌲
          </div>
          <span>치유</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow">
            📚
          </div>
          <span>교육</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shadow">
            ❤️
          </div>
          <span>봉사</span>
        </div>
      </div>
    </div>
  );
}
