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
      components: resolve(__dirname, '/src/components'),
      assets: resolve(__dirname, '/src/assets'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
}))
