// vite.config.mts
import { defineConfig } from "file:///C:/Users/Yijisyjik/source/repos/refined-prun/node_modules/.pnpm/vite@5.4.12_@types+node@20.17.6/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import libAssetsPlugin from "file:///C:/Users/Yijisyjik/source/repos/refined-prun/node_modules/.pnpm/@laynezh+vite-plugin-lib-assets@0.5.26_vite@5.4.12_@types+node@20.17.6_/node_modules/@laynezh/vite-plugin-lib-assets/dist/index.js";
import vue from "file:///C:/Users/Yijisyjik/source/repos/refined-prun/node_modules/.pnpm/@vitejs+plugin-vue@5.1.5_vite@5.4.12_@types+node@20.17.6__vue@3.5.13_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/Yijisyjik/source/repos/refined-prun/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.1.0_vite@5.4.12_@types+node@20.17.6__vue@3.5.13_typescript@5.4.5_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import unimport from "file:///C:/Users/Yijisyjik/source/repos/refined-prun/node_modules/.pnpm/unimport@3.13.1_rollup@4.31.0/node_modules/unimport/dist/unplugin.mjs";
import { createHash } from "crypto";
var __vite_injected_original_dirname = "C:\\Users\\Yijisyjik\\source\\repos\\refined-prun";
var isDev = process.env.NODE_ENV === "development";
var srcDir = resolve(__vite_injected_original_dirname, "src");
var noise = /* @__PURE__ */ new Set([
  "index",
  "dist",
  "src",
  "source",
  "distribution",
  "node_modules",
  ".pnpm",
  "main",
  "esm",
  "cjs",
  "build",
  "built"
]);
var outDir = resolve(__vite_injected_original_dirname, "dist");
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": srcDir,
      "~": resolve(srcDir, "assets")
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    unimport.vite({
      presets: [
        "vue",
        {
          from: "@src/utils/select-dom",
          imports: ["$", "$$", "_$", "_$$"]
        }
      ],
      imports: [
        { name: "C", from: "@src/infrastructure/prun-ui/prun-css" },
        { name: "subscribe", from: "@src/utils/subscribe-async-generator" },
        { name: "default", as: "tiles", from: "@src/infrastructure/prun-ui/tiles" },
        { name: "default", as: "features", from: "@src/features/feature-registry" },
        { name: "default", as: "xit", from: "@src/features/XIT/xit-registry" },
        { name: "default", as: "config", from: "@src/infrastructure/shell/config" },
        { name: "createFragmentApp", from: "@src/utils/vue-fragment-app" }
      ],
      //dts: 'src/types/unimport.d.ts',
      addons: {
        vueTemplate: true
      }
    }),
    libAssetsPlugin({
      outputPath: "assets",
      name: "[name].[contenthash:8].[ext]"
    })
  ],
  publicDir: resolve(__vite_injected_original_dirname, "public"),
  build: {
    outDir,
    emptyOutDir: !isDev,
    sourcemap: isDev ? "inline" : false,
    minify: false,
    reportCompressedSize: false,
    lib: {
      entry: {
        "refined-prun-prepare": resolve(srcDir, "refined-prun-prepare.ts"),
        "refined-prun-startup": resolve(srcDir, "refined-prun-startup.ts"),
        "refined-prun": resolve(srcDir, "refined-prun.ts")
      },
      formats: ["es"]
    },
    rollupOptions: {
      external: ["chrome"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "source",
        sanitizeFileName: (name) => name.replace("_virtual", "virtual").replace("\0", "").replace(":", "_"),
        assetFileNames: (assetInfo) => assetInfo.name?.endsWith("css") ? assetInfo.name.replace("style.css", "refined-prun.css") : "assets/[name]-[hash][extname]",
        entryFileNames(chunkInfo) {
          if (chunkInfo.name.includes("node_modules")) {
            const cleanName = chunkInfo.name.split("/").filter((part) => !noise.has(part)).join("-");
            return `npm/${cleanName}.js`;
          }
          return chunkInfo.name + ".js";
        }
      }
    }
  },
  css: {
    modules: {
      generateScopedName: sanitizeModuleClassname
    }
  },
  define: {
    // This define is needed for vue npm packages
    "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
  }
});
function sanitizeModuleClassname(name, filename) {
  if (typeof filename !== "string") {
    throw new Error("The filename must be string and cannot be undefined.");
  }
  const parts = filename.split("?")[0].split("/");
  const lastSegment = parts.pop();
  if (!lastSegment) {
    throw new Error("Filename must include a valid file name.");
  }
  const baseFilename = lastSegment.replace(/(\.vue|\.module)?(\.\w+)$/, "");
  const classname = `${baseFilename}__${name}`;
  const hash = getHash(`${classname}`);
  return `rp-${classname}___${hash}`;
}
function getHash(input) {
  return createHash("sha256").update(input).digest("hex").slice(0, 7);
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcWWlqaXN5amlrXFxcXHNvdXJjZVxcXFxyZXBvc1xcXFxyZWZpbmVkLXBydW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFlpamlzeWppa1xcXFxzb3VyY2VcXFxccmVwb3NcXFxccmVmaW5lZC1wcnVuXFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvWWlqaXN5amlrL3NvdXJjZS9yZXBvcy9yZWZpbmVkLXBydW4vdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgbGliQXNzZXRzUGx1Z2luIGZyb20gJ0BsYXluZXpoL3ZpdGUtcGx1Z2luLWxpYi1hc3NldHMnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcbmltcG9ydCB1bmltcG9ydCBmcm9tICd1bmltcG9ydC91bnBsdWdpbic7XG5pbXBvcnQgeyBjcmVhdGVIYXNoIH0gZnJvbSAnY3J5cHRvJztcblxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcblxuY29uc3Qgc3JjRGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKTtcblxuY29uc3Qgbm9pc2UgPSBuZXcgU2V0KFtcbiAgJ2luZGV4JyxcbiAgJ2Rpc3QnLFxuICAnc3JjJyxcbiAgJ3NvdXJjZScsXG4gICdkaXN0cmlidXRpb24nLFxuICAnbm9kZV9tb2R1bGVzJyxcbiAgJy5wbnBtJyxcbiAgJ21haW4nLFxuICAnZXNtJyxcbiAgJ2NqcycsXG4gICdidWlsZCcsXG4gICdidWlsdCcsXG5dKTtcblxuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0BzcmMnOiBzcmNEaXIsXG4gICAgICAnfic6IHJlc29sdmUoc3JjRGlyLCAnYXNzZXRzJyksXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZ1ZUpzeCgpLFxuICAgIHVuaW1wb3J0LnZpdGUoe1xuICAgICAgcHJlc2V0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAge1xuICAgICAgICAgIGZyb206ICdAc3JjL3V0aWxzL3NlbGVjdC1kb20nLFxuICAgICAgICAgIGltcG9ydHM6IFsnJCcsICckJCcsICdfJCcsICdfJCQnXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgIHsgbmFtZTogJ0MnLCBmcm9tOiAnQHNyYy9pbmZyYXN0cnVjdHVyZS9wcnVuLXVpL3BydW4tY3NzJyB9LFxuICAgICAgICB7IG5hbWU6ICdzdWJzY3JpYmUnLCBmcm9tOiAnQHNyYy91dGlscy9zdWJzY3JpYmUtYXN5bmMtZ2VuZXJhdG9yJyB9LFxuICAgICAgICB7IG5hbWU6ICdkZWZhdWx0JywgYXM6ICd0aWxlcycsIGZyb206ICdAc3JjL2luZnJhc3RydWN0dXJlL3BydW4tdWkvdGlsZXMnIH0sXG4gICAgICAgIHsgbmFtZTogJ2RlZmF1bHQnLCBhczogJ2ZlYXR1cmVzJywgZnJvbTogJ0BzcmMvZmVhdHVyZXMvZmVhdHVyZS1yZWdpc3RyeScgfSxcbiAgICAgICAgeyBuYW1lOiAnZGVmYXVsdCcsIGFzOiAneGl0JywgZnJvbTogJ0BzcmMvZmVhdHVyZXMvWElUL3hpdC1yZWdpc3RyeScgfSxcbiAgICAgICAgeyBuYW1lOiAnZGVmYXVsdCcsIGFzOiAnY29uZmlnJywgZnJvbTogJ0BzcmMvaW5mcmFzdHJ1Y3R1cmUvc2hlbGwvY29uZmlnJyB9LFxuICAgICAgICB7IG5hbWU6ICdjcmVhdGVGcmFnbWVudEFwcCcsIGZyb206ICdAc3JjL3V0aWxzL3Z1ZS1mcmFnbWVudC1hcHAnIH0sXG4gICAgICBdLFxuICAgICAgLy9kdHM6ICdzcmMvdHlwZXMvdW5pbXBvcnQuZC50cycsXG4gICAgICBhZGRvbnM6IHtcbiAgICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGxpYkFzc2V0c1BsdWdpbih7XG4gICAgICBvdXRwdXRQYXRoOiAnYXNzZXRzJyxcbiAgICAgIG5hbWU6ICdbbmFtZV0uW2NvbnRlbnRoYXNoOjhdLltleHRdJyxcbiAgICB9KSxcbiAgXSxcbiAgcHVibGljRGlyOiByZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYycpLFxuICBidWlsZDoge1xuICAgIG91dERpcixcbiAgICBlbXB0eU91dERpcjogIWlzRGV2LFxuICAgIHNvdXJjZW1hcDogaXNEZXYgPyAnaW5saW5lJyA6IGZhbHNlLFxuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHtcbiAgICAgICAgJ3JlZmluZWQtcHJ1bi1wcmVwYXJlJzogcmVzb2x2ZShzcmNEaXIsICdyZWZpbmVkLXBydW4tcHJlcGFyZS50cycpLFxuICAgICAgICAncmVmaW5lZC1wcnVuLXN0YXJ0dXAnOiByZXNvbHZlKHNyY0RpciwgJ3JlZmluZWQtcHJ1bi1zdGFydHVwLnRzJyksXG4gICAgICAgICdyZWZpbmVkLXBydW4nOiByZXNvbHZlKHNyY0RpciwgJ3JlZmluZWQtcHJ1bi50cycpLFxuICAgICAgfSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ2Nocm9tZSddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIHByZXNlcnZlTW9kdWxlczogdHJ1ZSxcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogJ3NvdXJjZScsXG4gICAgICAgIHNhbml0aXplRmlsZU5hbWU6IG5hbWUgPT5cbiAgICAgICAgICBuYW1lLnJlcGxhY2UoJ192aXJ0dWFsJywgJ3ZpcnR1YWwnKS5yZXBsYWNlKCdcXHgwMCcsICcnKS5yZXBsYWNlKCc6JywgJ18nKSxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGFzc2V0SW5mbyA9PlxuICAgICAgICAgIGFzc2V0SW5mby5uYW1lPy5lbmRzV2l0aCgnY3NzJylcbiAgICAgICAgICAgID8gYXNzZXRJbmZvLm5hbWUucmVwbGFjZSgnc3R5bGUuY3NzJywgJ3JlZmluZWQtcHJ1bi5jc3MnKVxuICAgICAgICAgICAgOiAnYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nLFxuICAgICAgICBlbnRyeUZpbGVOYW1lcyhjaHVua0luZm8pIHtcbiAgICAgICAgICBpZiAoY2h1bmtJbmZvLm5hbWUuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICBjb25zdCBjbGVhbk5hbWUgPSBjaHVua0luZm8ubmFtZVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAuZmlsdGVyKHBhcnQgPT4gIW5vaXNlLmhhcyhwYXJ0KSlcbiAgICAgICAgICAgICAgLmpvaW4oJy0nKTtcbiAgICAgICAgICAgIHJldHVybiBgbnBtLyR7Y2xlYW5OYW1lfS5qc2A7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNodW5rSW5mby5uYW1lICsgJy5qcyc7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGNzczoge1xuICAgIG1vZHVsZXM6IHtcbiAgICAgIGdlbmVyYXRlU2NvcGVkTmFtZTogc2FuaXRpemVNb2R1bGVDbGFzc25hbWUsXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgLy8gVGhpcyBkZWZpbmUgaXMgbmVlZGVkIGZvciB2dWUgbnBtIHBhY2thZ2VzXG4gICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogYFwiJHtwcm9jZXNzLmVudi5OT0RFX0VOVn1cImAsXG4gIH0sXG59KTtcblxuZnVuY3Rpb24gc2FuaXRpemVNb2R1bGVDbGFzc25hbWUobmFtZTogc3RyaW5nLCBmaWxlbmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiBmaWxlbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBmaWxlbmFtZSBtdXN0IGJlIHN0cmluZyBhbmQgY2Fubm90IGJlIHVuZGVmaW5lZC4nKTtcbiAgfVxuXG4gIGNvbnN0IHBhcnRzID0gZmlsZW5hbWUuc3BsaXQoJz8nKVswXS5zcGxpdCgnLycpO1xuICBjb25zdCBsYXN0U2VnbWVudCA9IHBhcnRzLnBvcCgpO1xuXG4gIGlmICghbGFzdFNlZ21lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGVuYW1lIG11c3QgaW5jbHVkZSBhIHZhbGlkIGZpbGUgbmFtZS4nKTtcbiAgfVxuXG4gIGNvbnN0IGJhc2VGaWxlbmFtZSA9IGxhc3RTZWdtZW50LnJlcGxhY2UoLyhcXC52dWV8XFwubW9kdWxlKT8oXFwuXFx3KykkLywgJycpO1xuXG4gIGNvbnN0IGNsYXNzbmFtZSA9IGAke2Jhc2VGaWxlbmFtZX1fXyR7bmFtZX1gO1xuICBjb25zdCBoYXNoID0gZ2V0SGFzaChgJHtjbGFzc25hbWV9YCk7XG5cbiAgcmV0dXJuIGBycC0ke2NsYXNzbmFtZX1fX18ke2hhc2h9YDtcbn1cblxuZnVuY3Rpb24gZ2V0SGFzaChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShpbnB1dCkuZGlnZXN0KCdoZXgnKS5zbGljZSgwLCA3KTtc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
