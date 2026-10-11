import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // [1] teruskan request API dari frontend ke backend Express
  server: {
    proxy: {
      "/api": {
        terget: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
});
