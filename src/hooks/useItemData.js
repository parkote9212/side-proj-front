import { useState, useEffect } from "react";
import { fetchItems } from "../api/itemApi";

const useItemData = (currentPage, activeKeyword, activeRegion, priceFrom, priceTo, dateFrom, dateTo) => {
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });

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
        setPageInfo(response.pageInfo || {});

        if (responseItems.length > 0) {
          const validItem = responseItems.find(item => 
            item.latitude !== null && item.longitude !== null &&
            item.latitude !== 0 && item.longitude !== 0
          );
          
          if (validItem) {
            const lat = Number(validItem.latitude);
            const lng = Number(validItem.longitude);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              setMapCenter({ lat, lng });
            }
          }
        }
      } catch (error) {
        setError(error.message || "데이터 로드 중 오류 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [currentPage, activeKeyword, activeRegion, priceFrom, priceTo, dateFrom, dateTo]);

  return { items, pageInfo, loading, error, mapCenter };
};

export default useItemData;