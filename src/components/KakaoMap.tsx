'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  markerTitle?: string;
  width?: string;
  height?: string;
  level?: number;
}

export default function KakaoMap({
  latitude,
  longitude,
  markerTitle = '활동 장소',
  width = '100%',
  height = '400px',
  level = 3
}: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

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
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: level
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);

      // 마커 생성
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });
      marker.setMap(map);

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${markerTitle}</div>`
      });
      infowindow.open(map, marker);
    };

    loadKakaoMap();
  }, [latitude, longitude, markerTitle, level]);

  return <div ref={mapContainer} style={{ width, height }} />;
}
