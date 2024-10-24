import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
    root: 'app/',
    publicDir: 'app/img/',
    base: './',
    build:
    {
        minify: true,
        outDir: '../dist',
        emptyOutDir: true
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,png}']
            },
            manifest: {
                name: "Take Off - Quadratis",
                short_name: "take off",
                icons: [
                    {
                        src: "./icons/quadratis192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "./icons/quadratis512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ],
                "start_url": "/",
                "display": "standalone",
                "background_color": "#111111",
                "theme_color": "#111111"
            }

        })
    ]
})
