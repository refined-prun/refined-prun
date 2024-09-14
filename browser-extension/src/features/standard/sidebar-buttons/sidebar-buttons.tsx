import classes from './sidebar-buttons.module.css';
import { observeReadyElementsByClassName } from '@src/utils/mutation-observer';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import SidebarButtons from './SidebarButtons.vue';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function onSidebarReady(sidebar: HTMLDivElement) {
  createFragmentApp(SidebarButtons).appendTo(sidebar);
}

export function init() {
  applyCssRule('#TOUR_TARGET_SIDEBAR_LEFT_02', classes.hide);
  observeReadyElementsByClassName(PrunCss.Frame.sidebar, onSidebarReady);
}

void features.add({
  id: 'sidebar-buttons',
  init,
});
