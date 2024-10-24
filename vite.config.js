const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env
import { resolve } from 'path'
export default {
    root: 'app/',
    publicDir: 'app/',
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
        commonjsOptions: { include: [] },
        sourcemap: true,

        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
            }
        }

    },
    optimizeDeps: {
        disabled: false,
    }
}
