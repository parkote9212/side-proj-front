// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 http://localhost:8080으로 보냄
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // '/api' 경로를 제거하지 않고 바로 백엔드 '/api/v1'에 연결되도록 함 (선택적)
      },
    },
  },
});
