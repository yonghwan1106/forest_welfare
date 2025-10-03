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

    // 카테고리별 마커 색상
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'healing':
          return 'green';
        case 'education':
          return 'blue';
        case 'volunteer':
          return 'red';
        default:
          return 'gray';
      }
    };

    // 카테고리별 마커 이미지
    const getMarkerImage = (category: string) => {
      const color = getCategoryColor(category);
      const imageSrc = `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_${color}.png`;
      const imageSize = new window.kakao.maps.Size(24, 35);
      return new window.kakao.maps.MarkerImage(imageSrc, imageSize);
    };

    // 마커 생성
    activities.forEach((activity) => {
      if (!activity.latitude || !activity.longitude) return;

      const position = new window.kakao.maps.LatLng(
        activity.latitude,
        activity.longitude
      );

      const marker = new window.kakao.maps.Marker({
        position: position,
        image: getMarkerImage(activity.category),
        title: activity.title
      });

      marker.setMap(map);

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px;min-width:150px;">
            <div style="font-weight:bold;margin-bottom:5px;">${activity.title}</div>
            <div style="font-size:12px;color:#666;">
              ${activity.location_sido} ${activity.location_sigungu}
            </div>
          </div>
        `
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (onMarkerClick) {
          onMarkerClick(activity.id);
        }
      });

      // 마우스 오버 이벤트
      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.open(map, marker);
      });

      // 마우스 아웃 이벤트
      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
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
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>치유</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>교육</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>봉사</span>
        </div>
      </div>
    </div>
  );
}
