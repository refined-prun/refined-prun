import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import { widgetAppend } from '@src/utils/vue-mount';
import TabBar from '@src/features/standard/screen-tab-bar/TabBar.vue';

function onContainerReady(container: HTMLDivElement) {
  widgetAppend(container, TabBar);
}

export function init() {
  observeReadyElementsByClassName(PrunCss.ScreenControls.container, onContainerReady);
}

void features.add({
  id: 'screen-tab-bar',
  init,
});
