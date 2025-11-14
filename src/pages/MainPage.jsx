import React, { useState, useEffect, useRef } from "react";
import { fetchItems, fetchItemDetail } from "../api/itemApi";
// import {
//   Map,
//   MapMarker,
//   MarkerClusterer,
//   useKakaoLoader,
// } from "react-kakao-maps-sdk";
import { BarLoader } from "react-spinners";
import useAuthStore from "../store/authStore";
import useSavedItemStore from "../store/savedItemStore";

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY;

const REGIONS = [
  { name: "전체", value: "" },
  { name: "서울특별시", value: "서울특별시" },
  { name: "경기도", value: "경기도" },
  { name: "인천광역시", value: "인천광역시" },
  { name: "강원특별자치도", value: "강원특별자치도" },
  { name: "충청남도", value: "충청남도" },
  { name: "충청북도", value: "충청북도" },
  { name: "대전광역시", value: "대전광역시" },
  { name: "세종특별자치시", value: "세종특별자치시" },
  { name: "전북특별자치도", value: "전북특별자치도" },
  { name: "전라남도", value: "전라남도" },
  { name: "광주광역시", value: "광주광역시" },
  { name: "경상북도", value: "경상북도" },
  { name: "경상남도", value: "경상남도" },
  { name: "대구광역시", value: "대구광역시" },
  { name: "울산광역시", value: "울산광역시" },
  { name: "부산광역시", value: "부산광역시" },
  { name: "제주특별자치도", value: "제주특별자치도" },
];

const MainPage = () => {
  // ===== 모든 useState 선언 (최상단) =====
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });

  // 필터용 useState
  const [inputKeyword, setInputKeyword] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const [activeRegion, setActiveRegion] = useState("");
  
  // 임시 필터 값들 (입력 중)
  const [tempPriceFrom, setTempPriceFrom] = useState("");
  const [tempPriceTo, setTempPriceTo] = useState("");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");
  
  // 적용된 필터 값들 (API 호출용)
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ===== 카카오맵 직접 로드 =====
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
  
  // 카카오맵 초기화
  useEffect(() => {
    if (mapLoaded && mapRef.current && window.kakao && window.kakao.maps) {
      try {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
          level: 7
        };
        const map = new window.kakao.maps.Map(container, options);
        
        // 지도 크기 재설정
        setTimeout(() => {
          map.relayout();
        }, 100);
        
        // 마커 추가
        items.forEach(item => {
          // null 값 및 유효성 검사
          if (item.latitude === null || item.longitude === null || 
              item.latitude === 0 || item.longitude === 0) {
            console.warn("Skipping null/zero coordinates:", item.cltrNo, item.latitude, item.longitude);
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
          } else {
            console.warn("Skipping invalid marker coordinates:", item.cltrNo, lat, lng);
          }
        });
      } catch (error) {
        console.error('Kakao Map Error:', error);
      }
    }
  }, [mapLoaded, items, mapCenter]);

  // ===== Zustand 스토어 (개별 selector로 메모이제이션) =====
  const token = useAuthStore((state) => state.token);
  const savedItemIds = useSavedItemStore((state) => state.savedItemIds);
  const fetchSaved = useSavedItemStore((state) => state.fetchSaved);
  const addSaved = useSavedItemStore((state) => state.addSaved);
  const removeSaved = useSavedItemStore((state) => state.removeSaved);

  const handleItemClick = async (cltrNo) => {
    setIsDetailLoading(true);
    setSelectedItem(null); // 이전 정보 초기화
    try {
      const detailData = await fetchItemDetail(cltrNo);
      setSelectedItem(detailData);
    } catch (e) {
      console.error("상세 정보 로드 실패:", e);
      alert("상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveKeyword(inputKeyword);
    setPriceFrom(tempPriceFrom);
    setPriceTo(tempPriceTo);
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
  };

  const handleRegionChange = (e) => {
    setCurrentPage(1);
    setActiveRegion(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    // "YYYY-MM-DD" 형식으로 변경
    return new Date(dateString).toISOString().split("T")[0];
  };

  // ===== useEffect: 로그인 시 찜 목록 1회 로드 =====
  useEffect(() => {
    if (token) {
      fetchSaved().catch(error => {
        console.warn('찜 목록 로드 실패 (백엔드 오류):', error.message);
      });
    }
  }, [token, fetchSaved]);

  // ===== useEffect: 물건 목록 로드 =====
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchItems({
          page: currentPage,
          size: 10,
          keyword: activeKeyword,
          region: activeRegion,
          priceFrom,
          priceTo,
          dateFrom,
          dateTo,
        });

        const responseItems = response.data || [];
        setItems(responseItems);
        console.log("ITEMS LOADED:", responseItems);
        console.log("FIRST ITEM:", responseItems[0]);
        setPageInfo(response.pageInfo || {});

        if (responseItems.length > 0) {
          // 유효한 좌표를 가진 첫 번째 아이템 찾기
          const validItem = responseItems.find(item => 
            item.latitude !== null && item.longitude !== null &&
            item.latitude !== 0 && item.longitude !== 0
          );
          
          if (validItem) {
            console.log("VALID ITEM COORDS:", validItem.latitude, validItem.longitude);
            const lat = Number(validItem.latitude);
            const lng = Number(validItem.longitude);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              setMapCenter({ lat, lng });
            }
          } else {
            console.warn("No valid coordinates found in items");
          }
        }
      } catch (error) {
        setError(error.message || "데이터 로드 중 오류 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [currentPage, activeKeyword, activeRegion, priceFrom, priceTo, dateFrom, dateTo]); // currentPage, activeKeyword, activeRegion이 바뀔 때마다 실행

  // --- (추가) 4. 찜하기 버튼 클릭 핸들러 ---
  const handleSaveToggle = (e, cltrNo) => {
    e.stopPropagation(); // 모달이 뜨지 않도록 이벤트 전파 중단

    if (!token) {
      alert("로그인이 필요합니다.");
      // navigate('/login'); // (선택) 로그인 페이지로 이동
      return;
    }

    // 찜 목록에 현재 cltrNo가 있는지 확인
    const isSaved = savedItemIds.includes(cltrNo);

    if (isSaved) {
      removeSaved(cltrNo); // 찜 취소
    } else {
      addSaved(cltrNo); // 찜하기
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" />
        <p className="ml-4 text-gray-600">데이터를 불러오는 중...</p>
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
    <div className="flex flex-col lg:flex-row h-screen p-2 lg:p-4 gap-2 lg:gap-4 bg-gray-50">
      {/* 지도 영역 */}
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

      {/* 목록 영역 */}
      <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
            경매 물건 목록
          </h2>
          <p className="text-sm text-gray-600">총 {pageInfo.totalCount || 0}개 물건</p>
        </div>

        {/* 필터링 및 검색 UI */}
        <div className="p-4 space-y-3 border-b border-gray-100">
          {/* 지역 선택 */}
          <select
            value={activeRegion}
            onChange={handleRegionChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {REGIONS.map((r) => (
              <option key={r.name} value={r.value}>
                {r.name}
              </option>
            ))}
          </select>

          {/* 키워드 검색 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="물건명, 주소 등 검색"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              검색
            </button>
          </div>

          {/* 가격 범위 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">가격 범위</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={tempPriceFrom}
                onChange={(e) => setTempPriceFrom(e.target.value)}
                placeholder="최저가"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-500 font-medium">~</span>
              <input
                type="number"
                value={tempPriceTo}
                onChange={(e) => setTempPriceTo(e.target.value)}
                placeholder="최고가"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* 날짜 범위 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">입찰 기간</label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={tempDateFrom}
                onChange={(e) => setTempDateFrom(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-500 font-medium">~</span>
              <input
                type="date"
                value={tempDateTo}
                onChange={(e) => setTempDateTo(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <BarLoader color="#3b82f6" />
                <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg mb-2">조회된 물건이 없습니다</p>
              <p className="text-gray-400 text-sm">다른 검색 조건을 시도해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const isSaved = savedItemIds.includes(item.cltrNo);
                return (
                  <div
                    key={item.cltrNo}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
                    onClick={() => handleItemClick(item.cltrNo)}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                      {item.cltrNm}
                    </h3>

                    <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-3">
                      {item.ctgrFullNm}
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">입찰 시작가</span>
                        <span className="font-bold text-red-600">
                          {item.minBidPrc ? `${item.minBidPrc.toLocaleString()}원` : "정보없음"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600">감정가</span>
                        <span className="font-semibold text-gray-700">
                          {item.apslAsesAvgAmt ? `${item.apslAsesAvgAmt.toLocaleString()}원` : "정보없음"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span>📅 {formatDate(item.pbctBegnDtm)} ~ {formatDate(item.pbctClsDtm)}</span>
                    </div>

                    {token && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToggle(e, item.cltrNo);
                        }}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          isSaved
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {isSaved ? "❤️ 찜 취소" : "💚 찜하기"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {pageInfo.totalPage > 1 && (
            <div className="flex justify-center items-center space-x-1 mb-3">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                이전
              </button>

              {Array.from(
                { length: Math.min(pageInfo.totalPage, 5) },
                (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageInfo.totalPage}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                다음
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            {currentPage} / {pageInfo.totalPage || 1} 페이지
          </div>
        </div>
      </div>
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedItem(null)} // 배경 클릭 시 닫기
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 닫히지 않게 함
          >
            <h3 className="text-2xl font-bold mb-4">
              {/* null 체크 없이 안전하게 접근 */}
              {selectedItem.masterInfo.cltrNm}
            </h3>
            <p className="text-gray-700 mb-4">
              {selectedItem.masterInfo.clnLdnmAdrs}
            </p>
            {/* --- [추가] 1. 담당자 정보 --- */}
            {selectedItem.basicInfo && (
              <div className="mb-4 p-3 bg-gray-50 rounded border">
                <h4 className="text-lg font-semibold mb-2 text-gray-800">
                  공고 담당자 정보
                </h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">담당부점:</span>{" "}
                  {selectedItem.basicInfo.rsbyDept || "정보 없음"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">담당자:</span>{" "}
                  {selectedItem.basicInfo.pscgNm || "정보 없음"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">연락처:</span>{" "}
                  {selectedItem.basicInfo.pscgTpno || "정보 없음"}
                </p>
              </div>
            )}

            {/* --- [추가] 2. 첨부 파일 목록 --- */}
            {selectedItem.fileList && selectedItem.fileList.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">첨부 파일</h4>
                <ul className="space-y-1 list-disc list-inside">
                  {selectedItem.fileList.map((file, index) => (
                    <li key={index} className="text-sm">
                      {/* (참고) 실제 다운로드 URL은 file.filePthCntn을 조합해야 할 수 있습니다. 
                        우선 파일명만 표시합니다.
                      */}
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {file.atchFileNm}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <h4 className="text-lg font-semibold mb-2">
              가격 변동 이력 ({selectedItem.priceHistory.length}건)
            </h4>

            {/* 상세 정보 로딩 상태 표시 추가 (선택 사항) */}
            {isDetailLoading ? (
              <BarLoader color="#36d7b7" />
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {selectedItem.priceHistory.map((history) => (
                  <li
                    key={history.cltrHstrNo}
                    className="flex justify-between border-b pb-1"
                  >
                    <span className="text-gray-600">
                      {new Date(history.pbctClsDtm).toLocaleDateString()} 마감
                    </span>
                    <span className="font-bold">
                      {history.minBidPrc.toLocaleString()}원
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
