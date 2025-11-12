import React, { useState, useEffect } from "react";
import { fetchItems } from "../api/itemApi";
import {
  Map,
  MapMarker,
  MarkerClusterer,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { BarLoader } from "react-spinners";


const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY;

const MainPage = () => {
  const { loading: _kakaoLoading, error: kakaoError } = useKakaoLoader({
    appkey: KAKAO_APP_KEY,
    libraries: ["services", "clusterer"],
  });

  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchItems({ page: currentPage, size: 10, keyword: "" });
        console.log('API Response:', response);
        console.log('PageInfo:', response.pageInfo);
        setItems(response.data || []);
        setPageInfo(response.pageInfo || {});
      } catch (error) {
        setError(error.message || "데이터 로드 중 오류 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [currentPage]);

  if (kakaoError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">카카오맵 로드 중 오류 발생: {kakaoError}</p>
      </div>
    );
  }

  const initialCenter = { lat: 37.5665, lng: 126.978 };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" />
        <p className="ml-4 text-gray-600">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen p-4 gap-4 bg-white">
      {/* 지도 영역 - 2/3 너비 */}
      <div className="w-2/3 shadow rounded-lg overflow-hidden">
        <Map
          center={initialCenter}
          style={{ width: "100%", height: "100%" }}
          level={7}
        >
          <MarkerClusterer averageCenter={true}>
            {items.map((item) => (
              <MapMarker
                key={item.cltrNo}
                position={{ lat: item.latitude, lng: item.longitude }}
                clickable={true}
              />
            ))}
          </MarkerClusterer>
        </Map>
      </div>

      {/* 목록 영역 - 1/3 너비 */}
      <div className="w-1/3 p-4 bg-white shadow rounded-lg overflow-y-auto border">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          경매 물건 목록 ({pageInfo.totalCount || 0}개)
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-500">조회된 물건이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.cltrNo}
                className="p-3 border border-gray-200 rounded hover:bg-blue-50 transition cursor-pointer"
              >
                <p className="text-lg font-semibold text-blue-700">
                  {item.cltrNm}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {item.clnLdnmAdrs}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* 페이지네이션 UI */}
        {pageInfo.totalPage > 1 && (
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              이전
            </button>
            
            {Array.from({ length: Math.min(pageInfo.totalPage, 10) }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageInfo.totalPage}
              className="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
        
        <div className="mt-2 text-center text-sm text-gray-500">
          {currentPage} / {pageInfo.totalPage || 1} 페이지 (총 {pageInfo.totalCount || 0}개)
        </div>
      </div>
    </div>
  );
};

export default MainPage;
