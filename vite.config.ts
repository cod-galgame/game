import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevtools from 'vite-plugin-vue-devtools';
import path from 'path';
import { encryptJsonPlugin } from './plugins/vite-plugin-encrypt-json';
import { randomizeAssetsPlugin } from './plugins/vite-plugin-randomize-assets';

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueDevtools(),
    // Only in production build
    command === "build" && randomizeAssetsPlugin(),
    command === "build" && encryptJsonPlugin(),
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
