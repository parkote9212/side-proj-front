import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import useAuthStore from '../store/authStore';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    
    const navigate = useNavigate();
    // Zustand 스토어에서 setToken 액션을 가져옵니다.
    const setToken = useAuthStore((state) => state.setToken);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);

        try {
            const response = await loginUser({ email, password });
            
            // 1. Zustand 스토어와 LocalStorage에 토큰 저장
            setToken(response.accessToken); 
            
            // 2. 메인 페이지로 이동
            navigate("/"); 

        } catch (error) {
            console.error("로그인 실패:", error.response?.data || error);
            // 백엔드에서 보낸 구체적인 오류 메시지를 표시
            setLoginError(error.response?.data?.message || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-xl rounded-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h1>
                
                {loginError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {loginError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-150"
                    >
                        로그인
                    </button>
                    <div className="text-center text-sm mt-3">
                        <a href="/register" className="text-blue-500 hover:underline">
                            계정이 없으신가요? 회원가입
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;