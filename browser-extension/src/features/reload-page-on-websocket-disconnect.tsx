import observeReadyElements from '@src/utils/selector-observer';
import features from '@src/feature-registry';
import PrunCss from '@src/prun-ui/prun-css';
import { dot } from '@src/utils/dot';

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
  observeReadyElements(dot(PrunCss.App.container), onAppLoaded);
  observeReadyElements(dot(PrunCss.Loading.loader), onLoadingAppeared);
}

void features.add({
  id: 'reload-page-on-websocket-disconnect',
  init,
});
