import { defineConfig } from 'vite';
import { resolve } from 'path';
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
        { name: 'L', from: '@src/infrastructure/prun-ui/i18n' },
        { name: 'subscribe', from: '@src/utils/observable' },
        { name: 'default', as: 'tiles', from: '@src/infrastructure/prun-ui/tiles' },
        { name: 'default', as: 'features', from: '@src/features/feature-registry' },
        { name: 'default', as: 'xit', from: '@src/features/XIT/xit-registry' },
        { name: 'default', as: 'config', from: '@src/infrastructure/shell/config' },
        { name: 'createFragmentApp', from: '@src/utils/vue-fragment-app' },
        { name: 'applyLocalizationPatch', from: '@src/infrastructure/prun-ui/i18n' },
        { name: 'applyCssRule', from: '@src/infrastructure/prun-ui/refined-prun-css' },
        { name: 'sumBy', from: '@src/utils/sum-by' },
      ],
      dts: 'src/types/unimport.d.ts',
      addons: {
        vueTemplate: true,
      },
    }),
  ],
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir,
    emptyOutDir: true,
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
    rolldownOptions: {
      external: ['chrome'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'source',
        sanitizeFileName: sanitizeOutputSegment,
        entryFileNames(chunkInfo) {
          if (chunkInfo.name.includes('node_modules')) {
            const cleanName = chunkInfo.name
              .split('/')
              .filter(part => !noise.has(part))
              .join('-');
            return `npm/${sanitizeOutputSegment(cleanName)}.js`;
          }

          return sanitizeOutputPath(chunkInfo.name) + '.js';
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
  const hash = getHash(classname);

  return `rp-${classname}___${hash}`;
}

function getHash(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 7);
}

function sanitizeOutputPath(path: string): string {
  return path.split('/').map(sanitizeOutputSegment).join('/');
}

function sanitizeOutputSegment(segment: string): string {
  const sanitized = segment
    .replace(/^_virtual$/, 'virtual')
    .replace(/^\0rolldown$/, 'rolldown')
    .replaceAll('\x00', '')
    .replaceAll(':', '_')
    .replaceAll('?', '_')
    .replaceAll('&', '_')
    .replaceAll('=', '_');

  return sanitized.replace(/^_+/, '') || 'virtual';
}
