import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
  port: 5173,
  proxy: {
    '/api/auth': {
      target: 'http://127.0.0.1:3001',  // better-auth Node server port
      changeOrigin: true,
      secure: false,
    },
    // If you have other /api data routes to FastAPI
    '/api/data': {  // example for data APIs
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      secure: false,
    },
  },

  },
})

