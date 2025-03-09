import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  resolve: {
    alias: {
      modules: '/src/modules',
      assets: '/src/assets'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.spec.{ts,tsx}'],
    globals: true,
    mockReset: true,
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/'
      ]
    }
  }
})
