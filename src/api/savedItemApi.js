// src/api/savedItemApi.js
import api from './axiosInstance';

// 1. 내 찜 목록(ID) 조회 API
export const fetchMySavedItems = async () => {
  // 백엔드의 GET /api/v1/saved-items 호출
  const response = await api.get('/saved-items');
  return response.data; // AuctionMasterDTO[] 반환
};

// 2. 찜하기 API
export const addSavedItem = async (cltrNo) => {
  // 백엔드의 POST /api/v1/saved-items/{item_id} 호출
  const response = await api.post(`/saved-items/${cltrNo}`);
  return response.data;
};

// 3. 찜 취소 API
export const deleteSavedItem = async (cltrNo) => {
  // 백엔드의 DELETE /api/v1/saved-items/{item_id} 호출
  const response = await api.delete(`/saved-items/${cltrNo}`);
  return response.data;
};