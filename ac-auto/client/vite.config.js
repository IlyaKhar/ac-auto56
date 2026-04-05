import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Vite 6: иначе при Host ≠ localhost (Docker, LAN, custom hostname) блокируются запросы к /@vite/client и .jsx — белый экран.
    allowedHosts: true,
    // Запросы на /api/* уходят на Fiber (только при npm run dev на хосте; в Docker клиент ходит на VITE_API_URL с браузера).
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true },
    },
  },
});
