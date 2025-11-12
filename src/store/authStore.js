import { create } from 'zustand';

// 1. Local Storage에서 초기 토큰 값을 읽어오는 함수
const getInitialToken = () => {
    // 키 이름은 axiosInstance.js와 일치해야 합니다.
    return localStorage.getItem('accessToken') || null;
};

// 2. Zustand 스토어 생성
const useAuthStore = create((set) => ({
    
    // 상태 (State)
    // 토큰 (초기값은 localStorage에서 읽어온 값)
    token: getInitialToken(),
    
    // 액션 (Actions)
    
    /**
     * 로그인 시 호출: 토큰을 스토어와 Local Storage에 저장합니다.
     * @param {string} newToken - 서버에서 발급받은 JWT Access Token
     */
    setToken: (newToken) => {
        // Zustand 상태 업데이트
        set({ token: newToken }); 
        
        // Local Storage에 저장하여 새로고침 시 로그인 상태 유지
        localStorage.setItem('accessToken', newToken);
    },
    
    /**
     * 로그아웃 시 호출: 토큰을 스토어와 Local Storage에서 삭제합니다.
     */
    clearToken: () => {
        // Zustand 상태 업데이트 (토큰을 null로 설정)
        set({ token: null });
        
        // Local Storage에서 삭제
        localStorage.removeItem('accessToken');
    }
}));

export default useAuthStore;