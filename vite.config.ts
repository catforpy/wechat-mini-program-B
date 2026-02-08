/**
 * Vite 配置文件
 * Uniapp 使用 Vite 构建工具
 */

import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, 'components'),
      '@/pages': path.resolve(__dirname, 'pages'),
      '@/styles': path.resolve(__dirname, 'styles'),
      '@/stores': path.resolve(__dirname, 'stores'),
      '@/utils': path.resolve(__dirname, 'utils'),
      '@/api': path.resolve(__dirname, 'api'),
      '@/config': path.resolve(__dirname, 'config'),
      '@/types': path.resolve(__dirname, 'types'),
      '@/mock': path.resolve(__dirname, 'mock')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    // 代理配置
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    // 生产环境移除 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
    // 注意：Uniapp 会自动处理分包，不需要 manualChunks
  }
})
