import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/react-git-log/' : '',
  plugins: [
    tsconfigPaths(),
    svgr(),
  ],
  resolve: {
    alias: {
      // Storybook Demo Aliases
      '@components': resolve(__dirname, '/src/components'),
      '@assets': resolve(__dirname, '/src/assets'),
      '@hooks': resolve(__dirname, '/src/hooks'),
      '@utils': resolve(__dirname, '/src/utils'),

      // The Library Root
      '@tomplum/react-git-log': resolve(__dirname, '../library/src'),

      // Absolute Library Imports
      modules: resolve(__dirname, '../library/src/modules'),
      assets: resolve(__dirname, '../library/src/assets'),
      components: resolve(__dirname, '../library/src/components'),
      context: resolve(__dirname, '../library/src/context'),
      hooks: resolve(__dirname, '../library/src/hooks'),
      constants: resolve(__dirname, '../library/src/constants'),
      types: resolve(__dirname, '../library/src/types')
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
    mockReset: true
  }
}))
