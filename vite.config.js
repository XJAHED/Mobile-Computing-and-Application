import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'logo.png'],
      manifest: {
        name: 'ReDrop - Real-time Blood Donation',
        short_name: 'ReDrop',
        description: 'Find and connect with blood donors in real-time.',
        theme_color: '#dc2626',
        background_color: '#f9fafb',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.png',
            sizes: '192x192 512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
