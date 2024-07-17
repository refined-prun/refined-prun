import { defineConfig } from 'vite';
import { resolve } from 'path';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './dev-tools/make-manifest-plugin';
import { watchPublicPlugin, watchRebuildPlugin } from '@refined-prun/hmr';
import { disableChunksPlugin } from './dev-tools/disable-chunks-plugin';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const manifestFile = resolve(__dirname, 'manifest.js');

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
    disableChunksPlugin(['src/system.ts']),
    libAssetsPlugin({
      outputPath: outDir,
    }),
    watchPublicPlugin(),
    makeManifestPlugin({ 
      outDir,
      manifestFile,
    }),
    isDev &&
    watchRebuildPlugin({
      options: {
        'socket-io-proxy': {
          skip: true,
        },
        'socket-io-proxy-inject': {
          skip: true,
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
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
      },
      input: {
        'refined-prun': resolve(__dirname, 'src/refined-prun.ts'),
        popup: resolve(__dirname, 'src/popup/popup.ts'),
        'socket-io-proxy': resolve(__dirname, 'src/prun-api/socket-io-proxy.ts'),
        'socket-io-proxy-inject': resolve(__dirname, 'src/prun-api/socket-io-proxy-inject.ts'),
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
