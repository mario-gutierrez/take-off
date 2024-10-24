const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
export default {
    root: 'app/',
    publicDir: 'app/img/',
    base: './',
    server:
    {
        host: true,
        open: !isCodeSandbox // Open if it's not a CodeSandbox
    },
    build:
    {
        minify: true,
        outDir: '../dist',
        emptyOutDir: true,

        rollupOptions: {
            input: {
                main: resolve(__dirname, 'app/index.html'),
            }
        }

    },
    optimizeDeps: {
        disabled: false,
    },
    plugins: [
        VitePWA({ registerType: 'autoUpdate' })
    ]
}
