import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import features from '@src/feature-registry';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.LiquidAssetsPanel.row), row => {
    const currency = refTextContent(row.children[0]);
    watchEffectWhileNodeAlive(row, () => {
      row.style.display = currency.value === 'ECD' ? 'none' : '';
    });
  });
}

export function init() {
  tiles.observe('FINLA', onTileReady);
}

void features.add({
  id: 'finla-hide-ecd',
  description: 'FINLA: Hides the row with ECD currency.',
  advanced: true,
  init,
});
