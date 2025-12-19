import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevtools from 'vite-plugin-vue-devtools';
import path from 'path';
import { encryptJsonPlugin } from './plugins/vite-plugin-encrypt-json';

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueDevtools(),
    // Only encrypt in production build to keep dev fast
    command === 'build' && encryptJsonPlugin()
  ].filter(Boolean),
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
