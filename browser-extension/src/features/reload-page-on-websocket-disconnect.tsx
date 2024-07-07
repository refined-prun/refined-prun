import observe from '@src/utils/selector-observer';
import features from '@src/feature-registry';
import { Style } from '@src/Style';

let appLoaded = false;

async function onAppLoaded() {
  appLoaded = true;
}

async function onLoadingAppeared() {
  if (!appLoaded) {
    return;
  }
  await timeout(1000);
  if (document.getElementsByClassName(Style.AppContainer[0]).length === 0) {
    location.reload();
  }
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function init() {
  observe(`.${Style.AppContainer[0]}`, onAppLoaded);
  observe(`.${Style.LoadingLoader[0]}`, onLoadingAppeared);
}

void features.add({
  id: 'reload-page-on-websocket-disconnect',
  init,
});
