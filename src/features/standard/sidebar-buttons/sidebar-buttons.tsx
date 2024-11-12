import css from '@src/utils/css-utils.module.css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import SidebarButtons from './SidebarButtons.vue';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule('#TOUR_TARGET_SIDEBAR_LEFT_02', css.hidden);
  subscribe($$(document, PrunCss.Frame.sidebar), sidebar => {
    createFragmentApp(SidebarButtons).appendTo(sidebar);
  });
}

features.add({
  id: 'sidebar-buttons',
  description: 'Adds a customizable sidebar with navigation buttons.',
  init,
});
