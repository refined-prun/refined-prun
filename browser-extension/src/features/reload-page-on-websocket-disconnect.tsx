import observe from '@src/utils/selector-observer';
import features from '@src/feature-registry';
import PrunCss from '@src/prun-ui/prun-css';
import { dot } from '@src/utils/dot';

let appLoaded = false;

async function onAppLoaded() {
  appLoaded = true;
}

async function onLoadingAppeared() {
  if (!appLoaded) {
    return;
  }
  await timeout(1000);
  if (document.getElementsByClassName(PrunCss.App.container).length === 0) {
    location.reload();
  }
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function init() {
  observe(dot(PrunCss.App.container), onAppLoaded);
  observe(dot(PrunCss.Loading.loader), onLoadingAppeared);
}

void features.add({
  id: 'reload-page-on-websocket-disconnect',
  init,
});
