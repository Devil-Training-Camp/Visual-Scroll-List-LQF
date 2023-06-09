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
      // externalGlobals({
      //   vue: 'Vue',
      // }),
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
        name: 'VisualScrollList',
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
