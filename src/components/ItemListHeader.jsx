import React from "react";

const ItemListHeader = ({ totalCount }) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
        경매 물건 목록
      </h2>
      <p className="text-sm text-gray-600">총 {totalCount || 0}개 물건</p>
    </div>
  );
};

export default ItemListHeader;