import classes from './order-book-highlight-own-orders.module.css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

function onTileReady(tile: PrunTile) {
  const rows = tile.anchor.getElementsByTagName('tr');
  const processRows = () => {
    for (const row of Array.from(rows)) {
      if (row.firstChild?.textContent === companyStore.value?.name) {
        row.classList.add(classes.highlight);
      } else {
        row.classList.remove(classes.highlight);
      }
    }
  };
  processRows();
  const observer = new MutationObserver(processRows);
  observer.observe(tile.anchor, { childList: true, subtree: true, characterData: true });
}

export function init() {
  tiles.observe('CXOB', onTileReady);
  tiles.observe('FXOB', onTileReady);
}

void features.add({
  id: 'order-book-highlight-own-orders',
  init,
});
