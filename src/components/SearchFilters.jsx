import React from "react";

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

const SearchFilters = ({
  activeRegion,
  inputKeyword,
  tempPriceFrom,
  tempPriceTo,
  tempDateFrom,
  tempDateTo,
  onRegionChange,
  onKeywordChange,
  onPriceFromChange,
  onPriceToChange,
  onDateFromChange,
  onDateToChange,
  onSearch,
  onKeyDown
}) => {
  return (
    <div className="p-4 space-y-3 border-b border-gray-100">
      <select
        value={activeRegion}
        onChange={onRegionChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          onChange={onKeywordChange}
          onKeyDown={onKeyDown}
          placeholder="물건명, 주소 등 검색"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          검색
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">가격 범위</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={tempPriceFrom}
            onChange={onPriceFromChange}
            placeholder="최저가"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <span className="text-gray-500 font-medium">~</span>
          <input
            type="number"
            value={tempPriceTo}
            onChange={onPriceToChange}
            placeholder="최고가"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">입찰 기간</label>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={tempDateFrom}
            onChange={onDateFromChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <span className="text-gray-500 font-medium">~</span>
          <input
            type="date"
            value={tempDateTo}
            onChange={onDateToChange}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;