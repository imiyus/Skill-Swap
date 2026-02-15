import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/hf': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf/, ''),
      },
      '/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/groq/, ''),
      },
    },
  },
})
