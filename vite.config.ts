import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
// import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '/cpns': fileURLToPath(new URL('./src/components', import.meta.url))
      },
      extensions: ['.js', '.json', '.ts', '.vue'],
    },
    build: {
      target: 'esnext',
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      vue({
        reactivityTransform: true,
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router'],
        dts: 'src/type/auto-import.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/type/components.d.ts',
      }),
      viteMockServe({
        mockPath: '/mock'
      }),
    ],
  }
})