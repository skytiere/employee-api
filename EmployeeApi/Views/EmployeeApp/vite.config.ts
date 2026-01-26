import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/weatherforecast": {
        target: "https://localhost:7064",
        secure: false,
        changeOrigin: true,
      },
      "/api": {
        target: "https://localhost:7064",
        secure: false,
        changeOrigin: true,
      },
      "/swagger": {
        target: "https://localhost:7064",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../../wwwroot",
    emptyOutDir: true,
  },
});
