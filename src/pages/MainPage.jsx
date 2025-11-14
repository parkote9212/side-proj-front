import React, { useState, useEffect } from "react";
import { fetchItemDetail } from "../api/itemApi";
import useAuthStore from "../store/authStore";
import useSavedItemStore from "../store/savedItemStore";
import KakaoMap from "../components/KakaoMap";
import SearchFilters from "../components/SearchFilters";
import ItemList from "../components/ItemList";
import Pagination from "../components/Pagination";
import ItemDetailModal from "../components/ItemDetailModal";
import { LoadingSpinner, ErrorDisplay } from "../components/LoadingError";
import useItemData from "../hooks/useItemData";
import { useSearchFilters } from "../hooks/useSearchFilters";

const MainPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    inputKeyword, setInputKeyword,
    activeKeyword, activeRegion,
    tempPriceFrom, setTempPriceFrom,
    tempPriceTo, setTempPriceTo,
    tempDateFrom, setTempDateFrom,
    tempDateTo, setTempDateTo,
    priceFrom, priceTo, dateFrom, dateTo,
    handleSearch: searchFiltersHandleSearch,
    handleRegionChange
  } = useSearchFilters();

  const { items, pageInfo, loading, error, mapCenter } = useItemData(
    currentPage, activeKeyword, activeRegion, priceFrom, priceTo, dateFrom, dateTo
  );



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
    searchFiltersHandleSearch();
  };

  const handleRegionChangeWithPage = (e) => {
    setCurrentPage(1);
    handleRegionChange(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ===== useEffect: 로그인 시 찜 목록 1회 로드 =====
  useEffect(() => {
    if (token) {
      fetchSaved().catch(error => {
        console.warn('찜 목록 로드 실패 (백엔드 오류):', error.message);
      });
    }
  }, [token, fetchSaved]);



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



  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="flex flex-col lg:flex-row h-screen p-2 lg:p-4 gap-2 lg:gap-4 bg-gray-50">
      <KakaoMap items={items} mapCenter={mapCenter} />
      
      <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
            경매 물건 목록
          </h2>
          <p className="text-sm text-gray-600">총 {pageInfo.totalCount || 0}개 물건</p>
        </div>

        <SearchFilters
          activeRegion={activeRegion}
          inputKeyword={inputKeyword}
          tempPriceFrom={tempPriceFrom}
          tempPriceTo={tempPriceTo}
          tempDateFrom={tempDateFrom}
          tempDateTo={tempDateTo}
          onRegionChange={handleRegionChangeWithPage}
          onKeywordChange={(e) => setInputKeyword(e.target.value)}
          onPriceFromChange={(e) => setTempPriceFrom(e.target.value)}
          onPriceToChange={(e) => setTempPriceTo(e.target.value)}
          onDateFromChange={(e) => setTempDateFrom(e.target.value)}
          onDateToChange={(e) => setTempDateTo(e.target.value)}
          onSearch={handleSearch}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <div className="flex-1 overflow-y-auto p-4">
          <ItemList
            items={items}
            loading={loading}
            token={token}
            savedItemIds={savedItemIds}
            onItemClick={handleItemClick}
            onSaveToggle={handleSaveToggle}
            formatDate={formatDate}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
        />
      </div>

      <ItemDetailModal
        selectedItem={selectedItem}
        isDetailLoading={isDetailLoading}
        onClose={() => setSelectedItem(null)}
        formatDate={formatDate}
      />
    </div>
  );
};

export default MainPage;
