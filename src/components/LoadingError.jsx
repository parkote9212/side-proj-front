import React from "react";
import { BarLoader, ClipLoader } from "react-spinners";

export const LoadingSpinner = ({ 
  type = "bar", 
  message = "데이터를 불러오는 중...", 
  size = 50,
  color = "#36d7b7" 
}) => (
  <div className="flex justify-center items-center h-screen">
    {type === "bar" ? (
      <BarLoader color={color} />
    ) : (
      <ClipLoader color={color} size={size} />
    )}
    <p className="ml-4 text-gray-600">{message}</p>
  </div>
);

export const ErrorDisplay = ({ error }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-red-600">{error}</p>
  </div>
);

export const EmptyState = ({ message = "데이터가 없습니다." }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-gray-500 text-xl">{message}</p>
  </div>
);