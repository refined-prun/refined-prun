import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';

let appLoaded = false;

async function onAppLoaded() {
  appLoaded = true;
}

async function onLoadingAppeared(element: HTMLElement) {
  if (!appLoaded) {
    return;
  }
  await timeout(1000);
  if (!element.isConnected) {
    return;
  }
  if (document.getElementsByClassName(PrunCss.App.container).length === 0) {
    location.reload();
  }
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function init() {
  observeReadyElementsByClassName(PrunCss.App.container, onAppLoaded);
  observeReadyElementsByClassName(PrunCss.Loading.loader, onLoadingAppeared);
}

void features.add({
  id: 'reload-page-on-websocket-disconnect',
  init,
});
