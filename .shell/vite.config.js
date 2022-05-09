import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// uncoment if you want use pwa
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@action': path.resolve(__dirname, './src/action'),
            '@constant': path.resolve(__dirname, './src/constant'),
            '@component': path.resolve(__dirname, './src/component'),
            '@hook': path.resolve(__dirname, './src/hook'),
            '@route': path.resolve(__dirname, './src/route'),
            '@store': path.resolve(__dirname, './src/store'),
            '@style': path.resolve(__dirname, './src/style'),
            '@service': path.resolve(__dirname, './src/service'),
            '@lib': path.resolve(__dirname, './src/lib')
        }
    },
    build: {
        sourcemap: false,
        chunkSizeWarningLimit: 500
    },
    plugins: [
        react(),
        // uncoment if you want use pwa
        // VitePWA({
        //     mode: 'development',
        //     base: '/',
        //     includeAssets: ['favicon.ico'],
        //     manifest: {
        //         name: 'My App',
        //         short_name: 'App',
        //         theme_color: '#000000',
        //         description: 'Description...',
        //         icons: [{
        //                 src: 'pwa-192x192.png',
        //                 sizes: '192x192',
        //                 type: 'image/png',
        //             },
        //             {
        //                 src: '/pwa-512x512.png',
        //                 sizes: '512x512',
        //                 type: 'image/png',
        //             },
        //             {
        //                 src: 'pwa-512x512.png',
        //                 sizes: '512x512',
        //                 type: 'image/png',
        //                 purpose: 'any maskable',
        //             },
        //         ],
        //     }
        // })
    ],
})