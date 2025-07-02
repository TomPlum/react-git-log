import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { resolve } from 'path'
import { analyzer } from 'vite-bundle-analyzer'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      svgr(),
      dts({
        tsconfigPath: 'tsconfig.build.json'
      }),
      libInjectCss(),
      analyzer({
        enabled: env.VITE_BUNDLE_ANALYSIS === 'true'
      })
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
        types: resolve(__dirname, 'src/types')
      }
    },
    build: {
      outDir: 'dist',
      lib: {
        formats: ['es'],
        name: 'react-git-log',
        fileName: 'react-git-log',
        entry: resolve(__dirname, '/src/index.ts')
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
        all: true,
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        cleanOnRerun: true,
        clean: true,
        reportOnFailure: true,
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'node_modules/',
          'dist',
          'src/_test',
          'src/types',
          'src/index.ts',
          'src/types.ts'
        ]
      }
    }
  }
})
