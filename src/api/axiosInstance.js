import axios from "axios";

// 백엔드 서버의 기본 URL로 Axios 인스턴스를 생성합니다.
// 개발 환경에서는 CORS 문제가 발생할 수 있으므로, Vite 프록시 설정을 사용하는 것이 권장됩니다.
// (Vite 프록시를 사용한다면 baseURL을 '/api'와 같이 상대 경로로 설정할 수도 있습니다.)

const instance = axios.create({
    // 이전에 'http://localhost:8080/api/v1' 이었다면, 
    // 이제는 백엔드 서버의 포트와 프로토콜을 제외한 경로만 남깁니다.
    // 이렇게 하면 요청이 현재 Vite 서버 (예: localhost:5173)로 전송됩니다.
    baseURL: '/api/v1', 
    
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 요청 인터셉터 설정 (JWT 연동의 핵심)
 * 모든 HTTP 요청이 서버로 전송되기 전에 실행됩니다.
 */

instance.interceptors.request.use(
  (config) => {
    // Local Storage에서 JWT 토큰을 읽어옵니다.
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Spring Security와 JwtAuthenticationFilter가 기대하는 "Bearer <토큰>" 포맷
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 요청 오류가 발생하면 (예: 네트워크 오류 등)
    return Promise.reject(error);
  }
);

export default instance;
