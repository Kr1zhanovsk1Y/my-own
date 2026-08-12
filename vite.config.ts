import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/my-own/',
  plugins: [react()],
  server: {
    proxy: {
      '/tmdb-api': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb-api/, ''),
        secure: true,
      },
    },
  },
})
