import { refTextContent } from '@src/utils/reactive-dom';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  const withdraw = L.AdminCenter.upcoming.action.withdrawVote();
  subscribe($$(tile.anchor, C.UpcomingTerm.container), container => {
    subscribe($$(container, 'table'), table => {
      subscribe($$(table, C.Button.primary), button => {
        const text = refTextContent(button);
        watchEffectWhileNodeAlive(button, () => {
          if (text.value === withdraw) {
            button.classList.add(C.Button.neutral);
          } else {
            button.classList.remove(C.Button.neutral);
          }
        });
      });
    });
  });
}

function init() {
  tiles.observe('ADM', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'ADM: Applies the "neutral" style to the "Withdraw" vote button.',
);
