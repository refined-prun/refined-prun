import { defineConfig } from 'vite';
import { resolve } from 'path';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './utils/make-manifest-plugin';
import { makeEntryPointPlugin, watchPublicPlugin, watchRebuildPlugin } from '@refined-prun/hmr';

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
    isDev && watchRebuildPlugin({
      entry: {
        'enhanced-prun': {
          refresh: true,
        },
        popup: {
          refresh: true,
        },
        'service_worker': {
          reload: true,
        },
      },
    }),
    isDev && makeEntryPointPlugin({
      entry: ['enhanced-prun', 'popup']
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
        'enhanced-prun': resolve(__dirname, 'src/index.ts'),
        popup: resolve(__dirname, 'src/popup/popup.ts'),
        'service_worker': resolve(__dirname, 'src/background/index.ts'),
      },
    },
  },
  define: {
    __FIREFOX__: process.env.__FIREFOX__ === 'true',
    __CHROME__: process.env.__FIREFOX__ !== 'true',
    'process.env.NODE_ENV': isDev ? `"development"` : `"production"`,
  },
});
