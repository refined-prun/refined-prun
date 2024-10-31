import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { refAnimationFrame } from '@src/utils/reactive-dom';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';

async function onTileReady(tile: PrunTile) {
  // Only process BS tiles with parameter
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.Site.workforces), workforces => {
    subscribe($$(workforces, 'tr'), row => {
      const cells = row.getElementsByTagName('td');
      if (cells.length === 0) {
        return;
      }

      const bar = cells[4].getElementsByTagName('div')[0];
      bar.style.display = 'flex';
      bar.style.flexDirection = 'row';
      bar.style.justifyContent = 'left';
      const progress = bar.getElementsByTagName('progress')[0];
      const progressTitle = refAnimationFrame(progress, x => x.title);
      const progressText = document.createElement('span');
      bar.appendChild(progressText);
      watchEffectWhileNodeAlive(progress, () => (progressText.textContent = progressTitle.value));
    });
  });
}

export function init() {
  tiles.observe('BS', onTileReady);
}

void features.add({
  id: 'bs-add-satisfaction-percentage',
  init,
});
