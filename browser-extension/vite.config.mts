import { defineConfig } from 'vite';
import { resolve } from 'path';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './dev-tools/make-manifest-plugin';
import { watchPublicPlugin, watchRebuildPlugin } from '@refined-prun/hmr';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;

const outDir = resolve(rootDir, '..', 'dist');
export default defineConfig({
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '@assets': resolve(srcDir, 'assets'),
    },
  },
  plugins: [
    libAssetsPlugin({
      outputPath: outDir,
    }),
    watchPublicPlugin(),
    makeManifestPlugin({ outDir }),
    isDev &&
      watchRebuildPlugin({
        options: {
          service_worker: {
            serviceWorker: true,
          },
        },
      }),
  ],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir,
    sourcemap: isDev ? 'inline' : true,
    minify: isProduction,
    reportCompressedSize: isProduction,
    modulePreload: true,
    rollupOptions: {
      external: ['chrome'],
      output: {
        dir: outDir,
        preserveModules: false,
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
      },
      input: {
        'refined-prun': resolve(__dirname, 'src/refined-prun.ts'),
        popup: resolve(__dirname, 'src/popup/popup.ts'),
        service_worker: resolve(__dirname, 'src/background/index.ts'),
      },
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'DocumentFragment',
  },
  define: {
    __FIREFOX__: process.env.__FIREFOX__ === 'true',
    __CHROME__: process.env.__FIREFOX__ !== 'true',
    __DEV__: isDev,
    'process.env.NODE_ENV': isDev ? `"development"` : `"production"`,
  },
});
