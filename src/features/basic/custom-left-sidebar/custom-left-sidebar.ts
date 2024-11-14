import css from '@src/utils/css-utils.module.css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import SidebarButtons from './SidebarButtons.vue';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import { refAttributeValue } from '@src/utils/reactive-dom';

function init() {
  applyCssRule('#TOUR_TARGET_SIDEBAR_LEFT_02', css.hidden);
  subscribe($$(document, C.Frame.sidebar), sidebar => {
    const com = _$$(sidebar, C.Frame.toggle).find(x => x.textContent === 'COM');
    const comIndicator = com ? _$(com, C.Frame.toggleIndicator) : undefined;
    const comClass = comIndicator ? refAttributeValue(comIndicator, 'class') : ref(undefined);
    const comPulse = computed(() => comClass.value?.includes(C.Frame.toggleIndicatorPulseActive));
    createFragmentApp(SidebarButtons, reactive({ comPulse })).appendTo(sidebar);
  });
}

features.add(import.meta.url, init, 'Makes the sidebar on the left customizable via settings.');
