import api from './axiosInstance';

// 백엔드의 Item 조회 API (Phase 2-6에 해당)
// PageResponseDTO 형식의 응답을 가정합니다.
export async function fetchItems({ page = 1, size = 10, keyword = '' }) {
    try {
        const response = await api.get("/items", {
            // baseURL이 이미 /api/v1로 설정되어 있으므로, /items만 사용합니다.
            params: { page, size, keyword }
        });
        
        // 백엔드가 PageResponseDTO 객체를 반환한다고 가정합니다.
        // { data: [...], pageInfo: {...} } 형태일 것입니다.
        return response.data; 

    } catch (error) {
    // 1. 서버가 응답을 보냈다면 (4xx, 5xx)
    if (error.response) {
        console.error("서버 응답 오류 (Status):", error.response.status);
        console.error("서버 응답 본문:", error.response.data);
    } 
    // 2. 서버가 응답하지 않았다면 (네트워크, CORS, 타임아웃)
    else if (error.request) {
        console.error("요청은 전송되었으나 응답을 받지 못함:", error.request);
    } 
    // 3. 요청 설정 오류
    else {
        console.error("Axios 요청 설정 오류:", error.message);
    }
    throw error;
    }
}