import { useState } from "react";

export const useSearchFilters = () => {
  const [inputKeyword, setInputKeyword] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const [activeRegion, setActiveRegion] = useState("");
  const [tempPriceFrom, setTempPriceFrom] = useState("");
  const [tempPriceTo, setTempPriceTo] = useState("");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSearch = () => {
    setActiveKeyword(inputKeyword);
    setPriceFrom(tempPriceFrom);
    setPriceTo(tempPriceTo);
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
  };

  const handleRegionChange = (value) => {
    setActiveRegion(value);
  };

  return {
    inputKeyword, setInputKeyword,
    activeKeyword, setActiveKeyword,
    activeRegion, setActiveRegion,
    tempPriceFrom, setTempPriceFrom,
    tempPriceTo, setTempPriceTo,
    tempDateFrom, setTempDateFrom,
    tempDateTo, setTempDateTo,
    priceFrom, setPriceFrom,
    priceTo, setPriceTo,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    handleSearch,
    handleRegionChange
  };
};