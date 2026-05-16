import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'doaai.local',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api.doaai.local:8000',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://api.doaai.local:8000',
        changeOrigin: true,
      },
    },
  },
})
