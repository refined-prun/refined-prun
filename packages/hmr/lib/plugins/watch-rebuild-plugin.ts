import type { PluginOption } from 'vite';
import { WebSocket } from 'ws';
import MessageInterpreter from '../interpreter';
import { LOCAL_RELOAD_SOCKET_URL } from '../constant';
import * as fs from 'fs';
import path from 'path';

interface ChunkOptions {
  serviceWorker?: boolean;
}

interface PluginConfig {
  onStart?: () => void;
  options: { [key: string]: ChunkOptions };
}

const injectionsPath = path.resolve(__dirname, '..', '..', '..', 'build', 'injections');

const refreshCode = fs.readFileSync(path.resolve(injectionsPath, 'refresh.js'), 'utf-8');
const reloadCode = fs.readFileSync(path.resolve(injectionsPath, 'reload.js'), 'utf-8');

export function watchRebuildPlugin(config: PluginConfig): PluginOption {
  let ws: WebSocket | undefined = undefined;
  const id = Math.random().toString(36);

  function initializeWebSocket() {
    if (ws === undefined) {
      ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);
      ws.onopen = () => {
        console.log(`[HMR] Connected to dev-server at ${LOCAL_RELOAD_SOCKET_URL}`);
      };
      ws.onerror = () => {
        console.error(`[HMR] Failed to start server at ${LOCAL_RELOAD_SOCKET_URL}`);
        console.warn('Retrying in 5 seconds...');
        ws = undefined;
        setTimeout(() => initializeWebSocket(), 5_000);
      };
    }
  }

  return {
    name: 'watch-rebuild',
    writeBundle() {
      config.onStart?.();
      if (!ws) {
        initializeWebSocket();
        return;
      }
      /**
       * When the build is complete, send a message to the reload server.
       * The reload server will send a message to the client to reload or refresh the extension.
       */
      if (!ws) {
        throw new Error('WebSocket is not initialized');
      }
      ws.send(MessageInterpreter.send({ type: 'build_complete', id }));
    },
    generateBundle(options, bundle) {
      const outputDir = options.dir;
      if (!outputDir) {
        throw new Error('Output directory not found');
      }
      for (const module of Object.values(bundle)) {
        if (module.type === 'chunk') {
          const fileName = path.basename(module.fileName);
          const chunkOptions = config.options[fileName.split('.')[0]];
          const { serviceWorker } = chunkOptions ?? {};
          const hmrFileName = fileName.replace('.js', '_hmr.js');
          const hmrCode = serviceWorker ? reloadCode : refreshCode;
          const hmrFile = `(function() {let __HMR_ID = "${id}";\n` + hmrCode + '\n' + '})();';
          fs.writeFileSync(path.resolve(outputDir, hmrFileName), hmrFile);
          // Extract code to a separate file for script cache busting
          const devFileName = fileName.replace('.js', '_dev.js');
          fs.writeFileSync(path.resolve(outputDir, devFileName), module.code);
          module.code =
            importStatement(hmrFileName, serviceWorker) + '\n' + importStatement(devFileName, serviceWorker);
        }
      }
    },
  };
}

function importStatement(fileName: string, serviceWorker?: boolean) {
  const isFirefox = process.env.__FIREFOX__ === 'true';
  if (isFirefox) {
    return `import(browser.runtime.getURL('${fileName}'));`;
  }

  if (serviceWorker) {
    return `import './${fileName}';`;
  }

  return `import('./${fileName}');`;
}
