import css from '@src/utils/css-utils.module.css';
import classes from './bbl-collapsible-categories.module.css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';
import {
  applyScopedClassCssRule,
  applyScopedCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';
import { ref } from 'vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.SectionList.container), container => {
    for (const divider of $$(container, PrunCss.SectionList.divider)) {
      // Hide Infrastructure (which is the first category) by default
      const enabled = ref(divider.parentElement?.firstChild !== divider);
      const indicator = document.createElement('div');
      indicator.classList.add(PrunCss.RadioItem.indicator);
      divider.firstChild!.before(indicator);
      watchEffectWhileNodeAlive(divider, () => {
        if (enabled.value) {
          indicator.classList.add(PrunCss.RadioItem.active);
          indicator.classList.add(PrunCss.effects.shadowPrimary);
        } else {
          indicator.classList.remove(PrunCss.RadioItem.active);
          indicator.classList.remove(PrunCss.effects.shadowPrimary);
        }
      });
      divider.addEventListener('click', () => {
        enabled.value = !enabled.value;
      });
    }
  });
}

export function init() {
  applyScopedCssRule(
    'BBL',
    `.${PrunCss.SectionList.divider}:not(:has(.${PrunCss.RadioItem.active})) + div`,
    css.hidden,
  );
  applyScopedClassCssRule('BBL', PrunCss.SectionList.divider, classes.divider);
  tiles.observe('BBL', onTileReady);
}

void features.add({
  id: 'bbl-collapsible-categories',
  init,
});
