import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevtools from 'vite-plugin-vue-devtools';
import path from 'path';

export default defineConfig({
  plugins: [vue(), vueDevtools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
