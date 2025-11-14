import React from "react";
import { BarLoader } from "react-spinners";

const ItemDetailModal = ({ selectedItem, isDetailLoading, onClose, formatDate }) => {
  if (!selectedItem) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4">
          {selectedItem.masterInfo?.cltrNm}
        </h3>
        <p className="text-gray-700 mb-4">
          {selectedItem.masterInfo?.clnLdnmAdrs}
        </p>

        {/* 담당자 정보 */}
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

        {/* 첨부 파일 목록 */}
        {selectedItem.fileList && selectedItem.fileList.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">첨부 파일</h4>
            <ul className="space-y-1 list-disc list-inside">
              {selectedItem.fileList.map((file, index) => (
                <li key={index} className="text-sm">
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {file.atchFileNm}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 가격 변동 이력 */}
        <h4 className="text-lg font-semibold mb-2">
          가격 변동 이력 ({selectedItem.priceHistory?.length || 0}건)
        </h4>

        {isDetailLoading ? (
          <BarLoader color="#36d7b7" />
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {selectedItem.priceHistory?.map((history) => (
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
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ItemDetailModal;