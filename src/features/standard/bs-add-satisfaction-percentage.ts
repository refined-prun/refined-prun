import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { refAnimationFrame } from '@src/utils/reactive-dom';
import { isEmpty } from 'ts-extras';

function onTileReady(tile: PrunTile) {
  // Only process BS tiles with parameter
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.Site.workforces), workforces => {
    subscribe($$(workforces, 'tr'), row => {
      const cells = _$$(row, 'td');
      if (isEmpty(cells)) {
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

function init() {
  tiles.observe('BS', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'BS: Adds a workforce satisfaction percentage label to the satisfaction progress bar.',
);
