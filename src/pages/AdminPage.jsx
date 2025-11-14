// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import api from "../api/axiosInstance"; // Axios 인스턴스

// Admin API 호출 함수
const runAdminBatch = () => {
  return api.post("/admin/batch/run"); // 2단계에서 만든 API
};

const fetchAllUsers = () => {
  return api.get("/admin/users");
};

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  const handleBatchRun = async () => {
    if (!window.confirm("정말로 수동 배치를 실행하시겠습니까?")) {
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await runAdminBatch();
      setMessage(`성공: ${response.data}`);
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      setMessage(`실패: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAllUsers();
        setUsers(response.data); // ◀ (List<UserResponse> 저장)
      } catch (err) {
        setUserError(
          err.response?.data?.message || err.message || "회원 목록 로딩 실패"
        );
      } finally {
        setUserLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="p-8 max-w-lg mx-auto mt-10 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>

      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">수동 배치 실행</h2>
        <button
          onClick={handleBatchRun}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? (
            <ClipLoader size={20} color="#fff" />
          ) : (
            "Onbid 데이터 수집 실행"
          )}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.startsWith("실패") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="border-t pt-4 mt-8">
        <h2 className="text-lg font-semibold mb-3">
          회원 목록 (총 {users.length}명)
        </h2>
        {userLoading ? (
          <div className="flex justify-center">
            <ClipLoader size={30} color="#36d7b7" />
          </div>
        ) : userError ? (
          <p className="text-red-600">{userError}</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">이메일</th>
                <th className="border p-2 text-left">닉네임</th>
                <th className="border p-2 text-left">권한(Role)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.nickname}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        user.role === "ADMIN"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
