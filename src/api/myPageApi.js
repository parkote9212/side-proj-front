import api from "./axiosInstance";

/**
 * 찜 목록 조회
 * @returns {Promise} 찜한 물건 목록
 */
export async function fetchSavedItems() {
    const response = await api.get("/saved-items");
    return response.data;
}
