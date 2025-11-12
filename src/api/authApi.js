import api from './axiosInstance';

/**
 * 사용자 회원가입
 * @param {Object} credentials - 회원가입 정보
 * @param {string} credentials.email - 사용자 이메일
 * @param {string} credentials.password - 사용자 비밀번호
 * @param {string} credentials.nickname - 사용자 닉네임
 * @returns {Promise<Object>} UserResponseDTO (id, email, nickname)
 * @throws {Error} 회원가입 실패 시 에러
 */
export async function registerUser({ email, password, nickname }) {
    try {
        const response = await api.post("/auth/register", { 
            email, 
            password, 
            nickname 
        });
        
        // 토큰이 반환된 경우 저장
        if (response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || '회원가입 중 오류가 발생했습니다.';
        console.error('[registerUser Error]', errorMsg);
        throw new Error(errorMsg);
    }
}

/**
 * 사용자 로그인
 * @param {Object} credentials - 로그인 정보
 * @param {string} credentials.email - 사용자 이메일
 * @param {string} credentials.password - 사용자 비밀번호
 * @returns {Promise<Object>} TokenResponse (accessToken, tokenType, expiresIn)
 * @throws {Error} 로그인 실패 시 에러
 */
export async function loginUser({ email, password }) {
    try {
        const response = await api.post("/auth/login", { 
            email, 
            password 
        });
        
        // JWT 토큰 저장 (axiosInstance에서 자동으로 Authorization 헤더 추가됨)
        if (response.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        
        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || '로그인 중 오류가 발생했습니다.';
        console.error('[loginUser Error]', errorMsg);
        throw new Error(errorMsg);
    }
}