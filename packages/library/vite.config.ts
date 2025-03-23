import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    dts(),
    libInjectCss()
  ],
  resolve: {
    alias: {
      modules: resolve(__dirname, '/src/modules'),
      assets: resolve(__dirname, '/src/assets'),
      components: resolve(__dirname, '/src/components'),
      context: resolve(__dirname, '/src/context'),
      hooks: resolve(__dirname, '/src/hooks'),
      constants: resolve(__dirname, '/src/constants'),
      data: resolve(__dirname, 'src/data'),
      test: resolve(__dirname, 'src/_test'),
    }
  },
  build: {
    outDir: 'dist',
    lib: {
      name: 'react-git-log',
      entry: resolve(__dirname, '/src/index.ts'),
      fileName: (format) => `react-git-log.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
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
    setupFiles: ['./src/_test/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      cleanOnRerun: true,
      clean: true,
      reportOnFailure: true,
      include: [
        'src'
      ],
      exclude: [
        'node_modules/',
        'dist',
        'src/_test'
      ]
    }
  }
})
