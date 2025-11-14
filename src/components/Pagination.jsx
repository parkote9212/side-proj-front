import React from "react";

const Pagination = ({ currentPage, pageInfo, onPageChange }) => {
  if (pageInfo.totalPage <= 1) return null;

  const totalPages = pageInfo.totalPage || 1;
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <div className="flex justify-center items-center space-x-1 mb-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          이전
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const pageNum = startPage + index;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          다음
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        {currentPage} / {totalPages} 페이지
      </div>
    </div>
  );
};

export default Pagination;