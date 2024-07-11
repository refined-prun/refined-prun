import observe from '@src/utils/selector-observer';
import features from '@src/feature-registry';
import PrunCss from '@src/prun-ui/prun-css';

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
  observe(`.${PrunCss.App.container}`, onAppLoaded);
  observe(`.${PrunCss.Loading.loader}`, onLoadingAppeared);
}

void features.add({
  id: 'reload-page-on-websocket-disconnect',
  init,
});
