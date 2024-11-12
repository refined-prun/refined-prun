import { createFragmentApp } from '@src/utils/vue-fragment-app';
import TabBar from '@src/features/standard/screen-tab-bar/TabBar.vue';

function init() {
  subscribe($$(document, C.ScreenControls.container), container => {
    createFragmentApp(TabBar).appendTo(container);
  });
}

features.add(import.meta.url, init, 'Adds a tab bar for user screens.');
