import React from "react";
import { BarLoader } from "react-spinners";

const ItemList = ({ 
  items, 
  loading, 
  token, 
  savedItemIds, 
  onItemClick, 
  onSaveToggle, 
  formatDate 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <BarLoader color="#3b82f6" />
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-gray-500 text-lg mb-2">조회된 물건이 없습니다</p>
        <p className="text-gray-400 text-sm">다른 검색 조건을 시도해보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isSaved = savedItemIds.includes(item.cltrNo);
        return (
          <div
            key={item.cltrNo}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
            onClick={() => onItemClick(item.cltrNo)}
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
                  onSaveToggle(e, item.cltrNo);
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
  );
};

export default ItemList;