import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import { viteMockServe } from 'vite-plugin-mock'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import startWebSocketServer from './mock'

export default defineConfig(({ mode }: ConfigEnv) => {
  let mockWebSocketServer;

  if (mode === 'development') {
    mockWebSocketServer = startWebSocketServer();
  }
  const env = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('/src', import.meta.url)),
        '/cpns': fileURLToPath(new URL('./src/components', import.meta.url))
      },
      extensions: ['.js', '.json', '.ts', '.vue'],
    },
    build: {
      target: 'esnext',
    },
    server: {
      port: env.VITE_PORT || 8080,
      proxy: {
        '/api': {
          target: env.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      ...(mode === 'development' && {
        after: () => {
          console.log('Mock WebSocket server listening on port 3000');
        },
        ws: {
          server: mockWebSocketServer,
        },
      }),
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
      // viteMockServe({
      //   mockPath: './mock',
      //   enable: true,
      //   watchFiles: true,
      // }),
    ],
  }
})