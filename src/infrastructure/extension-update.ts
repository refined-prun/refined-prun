import { sleep } from '@src/utils/sleep';
import { reloadPage } from '@src/infrastructure/prun-ui/page-functions';
import { loadLocalFile } from '@src/util';

export function reloadedInFirefox() {
  // In Firefox, on extension update/reload, content scripts are re-run, so we
  // can just check if the document has our attribute.
  return document.documentElement.hasAttribute('refined-prun');
}

export function trackReloadInChrome() {
  // In Chrome, on extension update/reload, content scripts are kept alive,
  // but the extension context is closed. To prevent lost data, track
  // the manifest version and reload the page once the version is changed.
  const version = chrome.runtime.getManifest().version;
  const id = setInterval(async () => {
    const manifest = await (await loadLocalFile('manifest.json')).json();
    if (manifest.version && version !== manifest.version) {
      void reloadExtension();
      clearInterval(id);
    }
  }, 1000);
}

export async function reloadExtension() {
  showConnectingScreen();
  await sleep(2000);
  reloadPage();
}

function showConnectingScreen() {
  const container = document.getElementById('container')!;
  const loading = document.createElement('div');
  loading.classList.add('Connecting__processing___u9cqumo', 'Connecting__overlay___oNNt5yF');
  loading.style.zIndex = '999999';
  const message = document.createElement('span');
  message.innerText = 'Reloading Refined PrUn...';
  message.classList.add(
    'Connecting__message___AQISYY3',
    'fonts__font-regular___Sxp1xjo',
    'type__type-larger___VdpJIb1',
  );
  loading.appendChild(message);
  container.appendChild(loading);
}
