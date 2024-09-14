import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import TabBar from '@src/features/standard/screen-tab-bar/TabBar.vue';

function onContainerReady(container: HTMLDivElement) {
  createFragmentApp(TabBar).appendTo(container);
}

export function init() {
  observeReadyElementsByClassName(PrunCss.ScreenControls.container, onContainerReady);
}

void features.add({
  id: 'screen-tab-bar',
  init,
});
