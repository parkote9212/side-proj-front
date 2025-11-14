import React, { useState, useEffect, useRef } from "react";
import { BarLoader } from "react-spinners";

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY;

const KakaoMap = ({ items, mapCenter }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);
  
  useEffect(() => {
    if (mapLoaded && mapRef.current && window.kakao && window.kakao.maps) {
      try {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
          level: 7
        };
        const map = new window.kakao.maps.Map(container, options);
        
        setTimeout(() => {
          map.relayout();
        }, 100);
        
        items.forEach(item => {
          if (item.latitude === null || item.longitude === null || 
              item.latitude === 0 || item.longitude === 0) {
            return;
          }
          
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const markerPosition = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(map);
          }
        });
      } catch (error) {
        console.error('Kakao Map Error:', error);
      }
    }
  }, [mapLoaded, items, mapCenter]);

  return (
    <div className="w-full lg:w-2/3 h-64 lg:h-full shadow-lg rounded-xl overflow-hidden bg-white">
      {mapLoaded ? (
        <div 
          ref={mapRef} 
          className="w-full h-full min-h-[400px] bg-gray-100"
        />
      ) : (
        <div className="flex justify-center items-center h-full bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <BarLoader color="#3b82f6" />
            <p className="mt-4 text-gray-600 font-medium">카카오맵 로드 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;