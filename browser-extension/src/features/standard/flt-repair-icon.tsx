import fa from '@src/utils/font-awesome.module.css';
import classes from './flt-repair-icon.module.css';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';
import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const ship = computed(() => shipsStore.getById(id.value));
    watchEffectWhileNodeAlive(row, () => {
      row.removeAttribute('rp-needs-repair');
      row.removeAttribute('rp-repair-critical');
      const condition = ship.value?.condition ?? 1;
      if (condition < 0.85) {
        row.setAttribute('rp-needs-repair', '');
      }
      if (condition < 0.8) {
        row.setAttribute('rp-repair-critical', '');
      }
    });
  });
}

function init() {
  tiles.observe('FLT', onTileReady);
  const selector = `tr[rp-needs-repair] td:nth-child(2) .${PrunCss.Link.link}:after`;
  applyScopedCssRule('FLT', selector, fa.solid);
  applyScopedCssRule('FLT', selector, classes.icon);
  applyScopedCssRule(
    'FLT',
    `tr[rp-repair-critical] td:nth-child(2) .${PrunCss.Link.link}:after`,
    classes.critical,
  );
}

features.add({
  id: 'flt-repair-icon',
  description: 'FLT: Adds a repair icon to ships with low condition.',
  init,
});
