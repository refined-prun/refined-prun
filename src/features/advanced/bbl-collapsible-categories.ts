import css from '@src/utils/css-utils.module.css';
import classes from './bbl-collapsible-categories.module.css';
import {
  applyScopedClassCssRule,
  applyScopedCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.SectionList.container), container => {
    for (const divider of $$(container, C.SectionList.divider)) {
      // Hide Infrastructure (which is the first category) by default
      const enabled = ref(divider.parentElement?.firstChild !== divider);
      const indicator = document.createElement('div');
      indicator.classList.add(C.RadioItem.indicator);
      divider.firstChild!.before(indicator);
      watchEffectWhileNodeAlive(divider, () => {
        if (enabled.value) {
          indicator.classList.add(C.RadioItem.active);
          indicator.classList.add(C.effects.shadowPrimary);
        } else {
          indicator.classList.remove(C.RadioItem.active);
          indicator.classList.remove(C.effects.shadowPrimary);
        }
      });
      divider.addEventListener('click', () => {
        enabled.value = !enabled.value;
      });
    }
  });
}

function init() {
  applyScopedCssRule(
    'BBL',
    `.${C.SectionList.divider}:not(:has(.${C.RadioItem.active})) + div`,
    css.hidden,
  );
  applyScopedClassCssRule('BBL', C.SectionList.divider, classes.divider);
  tiles.observe('BBL', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'BBL: Makes categories collapsible and collapses the "Infrastructure" category by default.',
);
