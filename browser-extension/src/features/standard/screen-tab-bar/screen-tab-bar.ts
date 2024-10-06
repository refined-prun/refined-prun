import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import TabBar from '@src/features/standard/screen-tab-bar/TabBar.vue';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';

export function init() {
  subscribe($$(document, PrunCss.ScreenControls.container), container => {
    createFragmentApp(TabBar).appendTo(container);
  });
}

void features.add({
  id: 'screen-tab-bar',
  init,
});
