import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 컴포넌트 및 페이지 임포트
import Navi from './components/Navi'; // Navi 컴포넌트 임포트
import MainPage from './pages/MainPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter> 
      <div className="App h-screen flex flex-col"> 
        <Navi /> 
        <main className="flex-1 overflow-auto"> 
          <Routes> 
            {/* 메인 페이지 (지도/목록) */}
            <Route path="/" element={<MainPage />} />
            
            {/* 통계 대시보드 */}
            <Route path="/dashboard" element={<DashboardPage />} /> 
            
            {/* 인증 관련 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* 마이 페이지 (찜 목록 - Navi에서 로그인 상태 체크) */}
            <Route path="/mypage" element={<MyPage />} /> 
            
            {/* 404 Not Found */}
            <Route path="*" element={<h1 className="text-4xl text-center pt-20">404 Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;