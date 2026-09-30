import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Typhoon Prep',
        short_name: 'TyphoonPrep',
        description: 'Offline-first typhoon preparation, response, and recovery app.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0b3d91',
        icons: [
          // TODO: replace with real icons before shipping (192x192 and 512x512 PNGs)
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Cache the app shell; API calls are handled by the app's own
        // fetch -> IndexedDB cache pattern, not by the service worker.
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
