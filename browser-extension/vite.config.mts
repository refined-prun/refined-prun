import { defineConfig } from 'vite';
import { resolve } from 'path';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './dev-tools/make-manifest-plugin';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import { createHash } from 'crypto';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const manifestFile = resolve(__dirname, 'manifest.js');

const isDev = process.env.__DEV__ === 'true';

const noise = new Set([
  'index',
  'dist',
  'src',
  'source',
  'distribution',
  'node_modules',
  '.pnpm',
  'main',
  'esm',
  'cjs',
  'build',
  'built',
]);

const outDir = resolve(rootDir, '..', 'dist');
export default defineConfig({
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '~': resolve(srcDir, 'assets'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    libAssetsPlugin({
      outputPath: outDir,
    }),
    makeManifestPlugin({
      outDir,
      manifestFile,
    }),
  ],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir,
    cssCodeSplit: false,
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    reportCompressedSize: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ['chrome'],
      preserveEntrySignatures: 'strict',
      output: {
        dir: outDir,
        preserveModules: true,
        preserveModulesRoot: 'source',
        sanitizeFileName: name => name.replace('_virtual', 'virtual').replace('\x00', ''),
        assetFileNames: assetInfo =>
          assetInfo.name?.endsWith('css')
            ? assetInfo.name.replace('style.css', 'refined-prun.css')
            : 'assets/[name]-[hash][extname]',
        entryFileNames(chunkInfo) {
          if (chunkInfo.name.includes('node_modules')) {
            const cleanName = chunkInfo.name
              .split('/')
              .filter(part => !noise.has(part))
              .join('-');
            return `npm/${cleanName}.js`;
          }

          return chunkInfo.name + '.js';
        },
      },
      input: {
        'content-script': resolve(__dirname, 'src/content-script.ts'),
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
