import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
      "@components": path.resolve(__dirname, 'src/components'),
      "@hooks": path.resolve(__dirname, 'src/hooks'),
      "@api": path.resolve(__dirname, 'src/api'),
      "@types": path.resolve(__dirname, 'src/types'),
      "@assets": path.resolve(__dirname, 'src/assets'),
      "@styles": path.resolve(__dirname, 'src/styles'),
    }
  }
})
