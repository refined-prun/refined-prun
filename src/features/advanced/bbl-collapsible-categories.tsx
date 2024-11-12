import css from '@src/utils/css-utils.module.css';
import classes from './bbl-collapsible-categories.module.css';
import {
  applyScopedClassCssRule,
  applyScopedCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';
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

function init() {
  applyScopedCssRule(
    'BBL',
    `.${PrunCss.SectionList.divider}:not(:has(.${PrunCss.RadioItem.active})) + div`,
    css.hidden,
  );
  applyScopedClassCssRule('BBL', PrunCss.SectionList.divider, classes.divider);
  tiles.observe('BBL', onTileReady);
}

features.add({
  id: 'bbl-collapsible-categories',
  description:
    'BBL: Makes categories collapsible and collapses the "Infrastructure" category by default.',
  init,
});
