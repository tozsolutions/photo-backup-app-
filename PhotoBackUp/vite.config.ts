import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/*.jpg', 'images/*.png', 'images/*.svg'],
      manifest: {
        name: 'Fotoğraf Yedekleme Sistemi',
        short_name: 'PhotoBackup',
        description: 'Otomatik WiFi fotoğraf yedekleme uygulaması',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/images/appicon.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '/images/appicon.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  },
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['date-fns', 'lucide-react']
        }
      }
    }
  }
})