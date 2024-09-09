import classes from './cxob-highlight-own-orders.module.css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

function onTileReady(tile: PrunTile) {
  const rows = tile.frame.getElementsByTagName('tr');
  const observer = new MutationObserver(() => {
    for (const row of Array.from(rows)) {
      if (row.firstChild?.textContent === companyStore.name) {
        row.classList.add(classes.highlight);
      } else {
        row.classList.remove(classes.highlight);
      }
    }
  });
  observer.observe(tile.frame, { childList: true, subtree: true, characterData: true });
}

export function init() {
  tiles.observe('CXOB', onTileReady);
}

void features.add({
  id: 'cxob-highlight-own-orders',
  init,
});
