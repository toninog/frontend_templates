import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: process.env.WEB_HOST || '0.0.0.0',
    port: parseInt(process.env.WEB_PORT || '5713'),
    proxy: {
      '/api': {
        target: `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || '8634'}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react'],
          'http-vendor': ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 200,
  },
})
