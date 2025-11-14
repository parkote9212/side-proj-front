// src/components/AdminRoute.jsx
import React from 'react';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // (설치 필요: npm install jwt-decode)

const AdminRoute = ({ children }) => {
  const { token } = useAuthStore((state) => state);

  if (!token) {
    // 1. 토큰이 없으면 로그인 페이지로
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. 토큰을 복호화(decode)하여 role 확인
    const decoded = jwtDecode(token);
    const role = decoded.role;

    if (role !== 'ADMIN') {
      // 3. ADMIN이 아니면 메인 페이지로
      return <Navigate to="/" replace />;
    }
    
    // 4. ADMIN이 맞으면 자식 컴포넌트(AdminPage) 렌더링
    return children;
    
  } catch (e) {
    console.error("JWT Decode Error", e);
    return <Navigate to="/login" replace />; // 비정상 토큰 시 로그인
  }
};

export default AdminRoute;