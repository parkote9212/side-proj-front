import React from "react";
import { BarLoader } from "react-spinners";

const LoadingSpinner = ({ message = "데이터를 불러오는 중..." }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <BarLoader color="#36d7b7" />
      <p className="ml-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;