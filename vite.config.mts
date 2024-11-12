import { defineConfig } from 'vite';
import { resolve } from 'path';
// import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import makeManifestPlugin from './dev-tools/make-manifest-plugin';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import unimport from 'unimport/unplugin';
import { createHash } from 'crypto';

const srcDir = resolve(__dirname, 'src');
const manifestFile = resolve(srcDir, 'manifest.js');

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

const outDir = resolve(__dirname, 'dist');

export default defineConfig({
  resolve: {
    alias: {
      '@src': srcDir,
      '~': resolve(srcDir, 'assets'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    unimport.vite({
      presets: [
        'vue',
        {
          from: '@src/utils/select-dom',
          imports: ['$', '$$', '_$', '_$$'],
        },
      ],
      imports: [
        { name: 'default', as: 'PrunCss', from: '@src/infrastructure/prun-ui/prun-css' },
        { name: 'subscribe', from: '@src/utils/subscribe-async-generator' },
        { name: 'default', as: 'tiles', from: '@src/infrastructure/prun-ui/tiles' },
        { name: 'default', as: 'features', from: '@src/feature-registry' },
        { name: 'default', as: 'xit', from: '@src/features/XIT/xit-registry' },
      ],
      dts: 'src/unimport.d.ts',
      addons: {
        vueTemplate: true,
      },
    }),
    // libAssetsPlugin({
    //   outputPath: 'assets',
    //   name: '[name].[contenthash:8].[ext]',
    // }),
    makeManifestPlugin({
      outDir,
      manifestFile,
    }),
  ],
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir,
    sourcemap: false,
    minify: false,
    reportCompressedSize: false,
    lib: {
      entry: {
        'content-script': resolve(srcDir, 'content-script.ts'),
        'refined-prun': resolve(srcDir, 'refined-prun.ts'),
        'refined-prun-prepare': resolve(srcDir, 'refined-prun-prepare.ts'),
        'prun-connector': resolve(srcDir, 'prun-connector.ts'),
        popup: resolve(srcDir, 'popup/popup.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['chrome'],
      output: {
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
