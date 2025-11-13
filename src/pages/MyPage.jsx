import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance"; // JWT가 포함된 인스턴스
import useAuthStore from "../store/authStore";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

// 찜 목록 API 호출 함수
async function fetchSavedItems() {
  try {
    const response = await api.get("/saved-items");
    // 백엔드에서 AuctionMasterDTO 리스트를 반환한다고 가정
    return response.data;
  } catch (error) {
    throw error;
  }
}

const MyPage = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useAuthStore((state) => state.token); // 토큰 존재 여부 확인용
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰이 없으면 로그인 페이지로 리다이렉트 (프론트엔드 보호)
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const loadSavedItems = async () => {
      try {
        const items = await fetchSavedItems();
        setSavedItems(items);
      } catch (err) {
        // 401/403 오류는 JWT 만료/무효화일 가능성이 높음
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          setError(
            "인증 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해주세요."
          );
        } else {
          setError(err.message || "찜 목록을 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4f46e5" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-xl font-bold">오류</h1>
        <p>{error}</p>
        {/* 401/403 에러 시 로그아웃 처리 및 이동 로직 추가 가능 */}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl min-h-screen">
      <h1 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-800">
        💖 내 찜 목록
      </h1>

      {savedItems.length === 0 ? (
        <p className="text-center text-gray-500 py-10 border border-dashed rounded-md">
          찜한 물건이 아직 없습니다.
        </p>
      ) : (
        <ul className="space-y-4">
          {savedItems.map((item) => (
            <li
              key={item.cltrNo}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="text-lg font-semibold text-indigo-700">
                  {item.ctgrFullNm}
                </p>
                <p className="text-sm text-gray-600">{item.clnLdnmAdrs}</p>
              </div>
              {/* 찜 취소 버튼 등 추가 가능 */}
              <button className="text-red-500 hover:text-red-700 text-sm">
                찜 취소
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPage;
