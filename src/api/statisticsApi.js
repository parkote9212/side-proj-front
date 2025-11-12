import api from './axiosInstance';

/**
 * 백엔드 통계 요약 정보 API를 호출합니다.
 * GET /api/v1/statistics/summary
 * @returns DashboardStatsDTO { regionAvgPrices: [], categoryCounts: [] }
 */
export async function fetchStatistics() {
    try {
        // baseURL이 이미 /api/v1로 설정되어 있으므로, /statistics/summary만 사용
        const response = await api.get("/statistics/summary"); 
        
        return response.data; 

    } catch (error) {
        console.error("통계 데이터 조회 실패:", error);
        throw error;
    }
}