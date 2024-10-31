import css from '@src/utils/css-utils.module.css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import SidebarButtons from './SidebarButtons.vue';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';

export function init() {
  applyCssRule('#TOUR_TARGET_SIDEBAR_LEFT_02', css.hidden);
  subscribe($$(document, PrunCss.Frame.sidebar), sidebar => {
    createFragmentApp(SidebarButtons).appendTo(sidebar);
  });
}

void features.add({
  id: 'sidebar-buttons',
  init,
});
