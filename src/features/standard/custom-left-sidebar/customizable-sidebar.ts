import css from '@src/utils/css-utils.module.css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import SidebarButtons from './SidebarButtons.vue';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule('#TOUR_TARGET_SIDEBAR_LEFT_02', css.hidden);
  subscribe($$(document, C.Frame.sidebar), sidebar => {
    createFragmentApp(SidebarButtons).appendTo(sidebar);
  });
}

features.add(import.meta.url, init, 'Makes the sidebar on the left customizable via options.');
