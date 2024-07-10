import * as fs from 'fs';
import * as path from 'path';
import type { PluginOption } from 'vite';
import { pathToFileURL } from 'url';
import * as process from 'process';
import { convertManifestToString } from './manifest-parser';
import { colorLog } from './logger';

const { resolve } = path;

interface PluginOptions {
  outDir: string;
  manifestFile: string;
}

function getManifestWithCacheBurst(manifestFile: string): Promise<{ default: chrome.runtime.ManifestV3 }> {
  const withCacheBurst = (path: string) => `${path}?${Date.now().toString()}`;
  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === 'win32') {
    return import(withCacheBurst(pathToFileURL(manifestFile).href));
  }
  return import(withCacheBurst(manifestFile));
}

export default function makeManifestPlugin(config: PluginOptions): PluginOption {
  function makeManifest(manifest: chrome.runtime.ManifestV3, to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, 'manifest.json');

    const isFirefox = process.env.__FIREFOX__;
    fs.writeFileSync(manifestPath, convertManifestToString(manifest, isFirefox ? 'firefox' : 'chrome'));

    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
  }

  return {
    name: 'make-manifest',
    buildStart() {
      this.addWatchFile(config.manifestFile);
    },
    async writeBundle() {
      const outDir = config.outDir;
      const manifest = await getManifestWithCacheBurst(config.manifestFile);
      makeManifest(manifest.default, outDir);
    },
  };
}
