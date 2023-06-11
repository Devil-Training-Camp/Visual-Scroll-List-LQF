import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      transformMode: {
        web: [/\.[jt]sx$/],
      },
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, 'src/index'),
        name: 'VisualScrollLib',
        fileName: 'visual-scroll-list',
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  }
})
