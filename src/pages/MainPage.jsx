import React, { useState, useEffect } from "react";
import { fetchItems, fetchItemDetail } from "../api/itemApi";
import {
  Map,
  MapMarker,
  MarkerClusterer,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
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

  // ===== Kakao 지도 로더 =====
  const { loading: _kakaoLoading, error: kakaoError } = useKakaoLoader({
    appkey: KAKAO_APP_KEY,
    libraries: ["services", "clusterer"],
  });

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
    // 토큰이 (로그인 상태) 있고, 찜 목록을 아직 로드 안했다면
    if (token) {
      fetchSaved();
    }
  }, [token, fetchSaved]); // token이 변경될 때(로그인/로그아웃) 실행

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
        });

        const responseItems = response.data || [];
        setItems(responseItems);
        setPageInfo(response.pageInfo || {});

        // 불러온 아이템 목록(responseItems)이 비어있지 않은지 확인
        if (responseItems.length > 0) {
          // 첫 번째 아이템의 좌표를 가져옵니다.
          const firstItem = responseItems[0];

          // 지도 중심점(mapCenter) 상태를 첫 번째 아이템의 좌표로 업데이트
          setMapCenter({ lat: firstItem.latitude, lng: firstItem.longitude });
        }
      } catch (error) {
        setError(error.message || "데이터 로드 중 오류 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [currentPage, activeKeyword, activeRegion]); // currentPage, activeKeyword, activeRegion이 바뀔 때마다 실행

  // --- (추가) 4. 찜하기 버튼 클릭 핸들러 ---
  const handleSaveToggle = (e, cltrNo) => {
    e.stopPropagation(); // 모달이 뜨지 않도록 이벤트 전파 중단

    if (!token) {
      alert("로그인이 필요합니다.");
      // navigate('/login'); // (선택) 로그인 페이지로 이동
      return;
    }

    // 찜 목록 Set에 있는지 확인
    const isSaved = savedItemIds.some(
      (savedItem) => savedItem.cltrNo === items.cltrNo
    );

    if (isSaved) {
      removeSaved(cltrNo); // 찜 취소
    } else {
      addSaved(cltrNo); // 찜하기
    }
  };

  if (kakaoError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">카카오맵 로드 중 오류 발생: {kakaoError}</p>
      </div>
    );
  }

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
          center={mapCenter}
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
      <div className="w-1/3 p-4 bg-white shadow rounded-lg border flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          경매 물건 목록 ({pageInfo.totalCount || 0}개)
        </h2>

        {/* 필터링 및 검색 UI */}
        <div className="mb-4 space-y-2">
          <select
            value={activeRegion}
            onChange={handleRegionChange}
            className="w-full p-2 border rounded-md"
          >
            {REGIONS.map((r) => (
              <option key={r.name} value={r.value}>
                {r.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="물건명, 주소 등 키워드 검색"
              className="flex-grow p-2 border rounded-md"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              검색
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <BarLoader color="#36d7b7" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              조회된 물건이 없습니다.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const isSaved = savedItemIds.includes(item.cltrNo);
                return (
                  <li
                    key={item.cltrNo}
                    className="p-3 border border-gray-200 rounded hover:bg-blue-50 transition"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => handleItemClick(item.cltrNo)}
                    >
                      {/* 1. 물건명 */}
                      <p className="text-lg font-semibold text-blue-700">
                        {item.cltrNm}
                      </p>

                      {/* 2. 카테고리 */}
                      <p className="text-sm text-gray-500 mb-2">
                        {item.ctgrFullNm}
                      </p>

                      {/* 3. 최신 최저/최고가 */}
                      <div className="text-sm">
                        <span className="text-gray-600">최신 입찰가: </span>
                        <span className="font-bold text-red-600">
                          {item.minBidPrc
                            ? item.minBidPrc.toLocaleString()
                            : "정보없음"}
                          원
                        </span>
                        <span className="text-gray-500"> ~ </span>
                        <span className="font-bold text-gray-700">
                          {item.apslAsesAvgAmt
                            ? item.apslAsesAvgAmt.toLocaleString()
                            : "정보없음"}
                          원
                        </span>
                      </div>

                      {/* 4. 최신 입찰일자 */}
                      <div className="text-sm text-gray-600 mt-1">
                        <span>입찰 기간: </span>
                        <span>{formatDate(item.pbctBegnDtm)}</span>
                        <span> ~ </span>
                        <span>{formatDate(item.pbctClsDtm)}</span>
                      </div>
                    </div>

                    {/* 찜하기 버튼 - 로그인 상태일 때만 표시 */}
                    {token && (
                      <button
                        onClick={(e) => handleSaveToggle(e, item.cltrNo)}
                        className={`w-full mt-2 py-1 rounded text-sm font-medium transition
                        ${
                          isSaved
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      >
                        {isSaved ? "❤️ 찜 취소" : "💚 찜하기"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-auto pt-4">
          {/* 페이지네이션 UI */}
          {pageInfo.totalPage > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                이전
              </button>

              {Array.from(
                { length: Math.min(pageInfo.totalPage, 10) },
                (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
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
                className="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}

          <div className="mt-2 text-center text-sm text-gray-500">
            {currentPage} / {pageInfo.totalPage || 1} 페이지 (총{" "}
            {pageInfo.totalCount || 0}개)
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
