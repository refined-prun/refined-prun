import { createFragmentApp } from '@src/utils/vue-fragment-app';
import TabBar from '@src/features/standard/screen-tab-bar/TabBar.vue';

function init() {
  subscribe($$(document, PrunCss.ScreenControls.container), container => {
    createFragmentApp(TabBar).appendTo(container);
  });
}

features.add({
  id: 'screen-tab-bar',
  description: 'Adds a tab bar for user screens.',
  init,
});
