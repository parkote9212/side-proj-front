// src/store/savedItemStore.js
import { create } from 'zustand';
import { fetchMySavedItems, addSavedItem, deleteSavedItem } from '../api/savedItemApi';

const useSavedItemStore = create((set) => ({
  // 찜한 아이템의 cltrNo를 배열로 관리 (Set 대신 배열 사용 - 직렬화 가능)
  savedItemIds: [],
  
  // (액션) 1. [최초 로딩] 내 찜 목록 API를 호출해 배열을 채움
  fetchSaved: async () => {
    try {
      const savedItems = await fetchMySavedItems(); // DTO 목록 반환
      // DTO 목록을 ID(cltrNo)의 배열로 변환
      const idArray = savedItems.map(item => item.cltrNo);
      set({ savedItemIds: idArray });
    } catch (error) {
      console.error("찜 목록 로딩 실패:", error);
      // 로그아웃되었거나 토큰이 만료되면 찜 목록을 비움
      set({ savedItemIds: [] });
    }
  },

  // (액션) 2. [찜하기] API 호출 및 배열에 추가
  addSaved: async (cltrNo) => {
    try {
      await addSavedItem(cltrNo);
      // API 성공 시, 전역 상태(배열)에도 즉시 반영
      set((state) => ({
        savedItemIds: [...state.savedItemIds, cltrNo]
      }));
    } catch (error) {
      console.error("찜하기 실패:", error);
    }
  },

  // (액션) 3. [찜 취소] API 호출 및 배열에서 제거
  removeSaved: async (cltrNo) => {
    try {
      await deleteSavedItem(cltrNo);
      // API 성공 시, 전역 상태(배열)에서도 즉시 반영
      set((state) => ({
        savedItemIds: state.savedItemIds.filter(id => id !== cltrNo)
      }));
    } catch (error) {
      console.error("찜 취소 실패:", error);
    }
  }
}));

export default useSavedItemStore;