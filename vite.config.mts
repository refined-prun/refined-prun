import { defineConfig } from 'vite';
import { resolve } from 'path';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import unimport from 'unimport/unplugin';
import { createHash } from 'crypto';

const isDev = process.env.NODE_ENV === 'development';

const srcDir = resolve(__dirname, 'src');

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
    unimport.vite({
      presets: [
        'vue',
        {
          from: '@src/utils/select-dom',
          imports: ['$', '$$', '_$', '_$$'],
        },
      ],
      imports: [
        { name: 'C', from: '@src/infrastructure/prun-ui/prun-css' },
        { name: 'subscribe', from: '@src/utils/subscribe-async-generator' },
        { name: 'default', as: 'tiles', from: '@src/infrastructure/prun-ui/tiles' },
        { name: 'default', as: 'features', from: '@src/features/feature-registry' },
        { name: 'default', as: 'xit', from: '@src/features/XIT/xit-registry' },
        { name: 'default', as: 'config', from: '@src/infrastructure/shell/config' },
        { name: 'createFragmentApp', from: '@src/utils/vue-fragment-app' },
        { name: 'applyCssRule', from: '@src/infrastructure/prun-ui/refined-prun-css' },
      ],
      //dts: 'src/types/unimport.d.ts',
      addons: {
        vueTemplate: true,
      },
    }),
    libAssetsPlugin({
      outputPath: 'assets',
      name: '[name].[contenthash:8].[ext]',
    }),
  ],
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir,
    emptyOutDir: !isDev,
    sourcemap: isDev ? 'inline' : false,
    minify: false,
    reportCompressedSize: false,
    lib: {
      entry: {
        'refined-prun-prepare': resolve(srcDir, 'refined-prun-prepare.ts'),
        'refined-prun-startup': resolve(srcDir, 'refined-prun-startup.ts'),
        'refined-prun': resolve(srcDir, 'refined-prun.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['chrome'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'source',
        sanitizeFileName: name =>
          name.replace('_virtual', 'virtual').replace('\x00', '').replace(':', '_'),
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
    // This define is needed for vue npm packages
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
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
