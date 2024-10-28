import { defineConfig } from 'vite';
import { resolve } from 'path';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './dev-tools/make-manifest-plugin';
import { watchPublicPlugin, watchRebuildPlugin } from '@refined-prun/hmr';
import { disableChunksPlugin } from './dev-tools/disable-chunks-plugin';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import { createHash } from 'crypto';

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
    vue(),
    vueJsx(),
    vueDevTools(),
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
          'refined-prun-prepare': {
            skip: true,
          },
          'prun-connector': {
            skip: true,
          },
        },
      }),
  ],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : true,
    minify: isProduction,
    reportCompressedSize: false,
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
        'refined-prun-prepare': resolve(__dirname, 'src/refined-prun-prepare.ts'),
        'prun-connector': resolve(__dirname, 'src/prun-connector.ts'),
        popup: resolve(__dirname, 'src/popup/popup.ts'),
      },
    },
  },
  css: {
    modules: {
      generateScopedName: sanitizeModuleClassname,
    },
  },
  define: {
    __FIREFOX__: process.env.__FIREFOX__ === 'true',
    __CHROME__: process.env.__FIREFOX__ !== 'true',
    __DEV__: isDev,
    'process.env.NODE_ENV': isDev ? `"development"` : `"production"`,
  },
});

function sanitizeModuleClassname(name: string, filename: string | undefined): string {
  if (typeof filename !== 'string') {
    throw new Error('The filename must be string and cannot be undefined.');
  }

  const parts = filename.split('?')[0].split('/');
  const lastSegment = parts.pop();

  if (!lastSegment) {
    throw new Error('Filename must include a valid file name.');
  }

  const baseFilename = lastSegment.replace(/(\.vue|\.module)?(\.\w+)$/, '');

  const classname = `${baseFilename}__${name}`;
  const hash = getHash(`${classname}`);

  return `rp-${classname}___${hash}`;
}

function getHash(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 7);
}
