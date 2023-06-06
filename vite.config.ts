import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue-jsx'
import externalGlobals from 'rollup-plugin-external-globals'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      externalGlobals({
        vue: 'Vue',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, 'src/index'),
        name: 'myLib',
        fileName: 'visual-scroll-list',
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          format: 'es',
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  }
})
