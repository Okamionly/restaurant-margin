import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'RestauMargin — Gestion de marge pour restaurants',
        short_name: 'RestauMargin',
        description: 'Calculez vos marges, gerez vos recettes et fiches techniques, optimisez vos couts avec l\'IA. La plateforme tout-en-un pour restaurateurs.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/dashboard',
        scope: '/',
        lang: 'fr',
        orientation: 'any',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
        screenshots: [
          {
            src: '/images/screenshot-phone.png',
            sizes: '1080x1920',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Dashboard RestauMargin sur mobile',
          },
          {
            src: '/images/screenshot-tablet.png',
            sizes: '2048x1536',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Dashboard RestauMargin sur tablette',
          },
        ],
        shortcuts: [
          {
            name: 'Tableau de bord',
            short_name: 'Dashboard',
            url: '/dashboard',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'Mes recettes',
            short_name: 'Recettes',
            url: '/recipes',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'Fournisseurs',
            short_name: 'Fournisseurs',
            url: '/suppliers',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'Assistant IA',
            short_name: 'IA',
            url: '/assistant',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        // Only precache essential shell files (HTML + CSS + critical JS), not all 79 entries
        globPatterns: ['**/*.html', '**/*.css', '**/vendor-react-*.js', '**/index-*.js'],
        // Force new SW to take over immediately on deploy
        skipWaiting: true,
        clientsClaim: true,
        // Clean old precaches from previous builds
        cleanupOutdatedCaches: true,
        // Navigation fallback for SPA
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          // API GET requests: serve stale while revalidating
          {
            urlPattern: /\/api\/(?!auth\/)(?!ai\/)(.*)/i,
            handler: 'StaleWhileRevalidate',
            method: 'GET',
            options: {
              cacheName: 'api-get-cache',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 5, // 5 min
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // API POST/PUT/DELETE: always hit network
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkOnly',
            method: 'POST',
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkOnly',
            method: 'PUT',
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkOnly',
            method: 'DELETE',
          },
          // JS/CSS chunks loaded on demand (lazy routes)
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /\.(?:woff2?|ttf|otf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
        },
        // Stable chunk names for better long-term caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
