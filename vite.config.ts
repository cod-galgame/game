import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevtools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";
// import { encryptJsonPlugin } from './plugins/vite-plugin-encrypt-json';
// import { randomizeAssetsPlugin } from './plugins/vite-plugin-randomize-assets';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueDevtools(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "战地诊所：从0开始的cod-galgame",
        short_name: "战地诊所",
        description: "一款战地诊所主题的视觉小说游戏",
        theme_color: "#c288a4",
        background_color: "#d0bccc",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,mp4,json,woff,woff2}"],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB for video files
      },
    }),
    // // Only in production build
    // command === "build" && randomizeAssetsPlugin(),
    // command === "build" && encryptJsonPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
  },
}));
