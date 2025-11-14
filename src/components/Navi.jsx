import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navi = () => {
    // Zustand 스토어에서 상태와 액션을 가져옵니다.
    const token = useAuthStore((state) => state.token);
    const clearToken = useAuthStore((state) => state.clearToken);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken(); // Zustand 및 LocalStorage에서 토큰 삭제
        alert("로그아웃 되었습니다.");
        navigate('/'); // 메인 페이지로 리다이렉트
    };

    return (
        <header className="bg-indigo-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* --- 로고/메인 링크 --- */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-extrabold tracking-wider hover:text-indigo-200 transition duration-150">
                            옥션 맵 🗺️
                        </Link>
                    </div>

                    {/* --- 네비게이션 링크 --- */}
                    <div className="flex space-x-4">
                        <Link to="/" className="nav-link">지도/목록</Link>
                        <Link to="/dashboard" className="nav-link">통계 대시보드</Link>
                        
                        {/* 로그인 상태에 따른 마이페이지 링크 */}
                        {token && (
                            <Link to="/mypage" className="nav-link text-yellow-300">찜 목록</Link>
                        )}
                    </div>

                    {/* --- 인증 버튼 --- */}
                    <div className="flex items-center gap-2">
                        {token ? (
                            <button 
                                onClick={handleLogout}
                                className="px-3 py-1 bg-red-500 rounded-md text-sm font-medium hover:bg-red-600 transition"
                            >
                                로그아웃
                            </button>
                        ) : (
                          <>
                                <Link 
                                    to="/login" 
                                    className="px-3 py-1 bg-green-500 rounded-md text-sm font-medium hover:bg-green-600 transition"
                                >
                                    로그인
                                </Link>
                                
                                {/* 💡 추가된 회원가입 버튼 */}
                                <Link 
                                    to="/register" 
                                    className="px-3 py-1 bg-indigo-400 rounded-md text-sm font-medium hover:bg-indigo-500 transition"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
            
            {/* Tailwind CSS를 위한 임시 스타일 (Navi.jsx 내부에 정의) */}
            <style>{`
                .nav-link {
                    padding: 0 1rem;
                    display: flex;
                    align-items: center;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: inherit;
                    transition: color 0.15s;
                }
                .nav-link:hover {
                    color: #d1d5db; /* gray-300 */
                }
            `}</style>
        </header>
    );
};

export default Navi;