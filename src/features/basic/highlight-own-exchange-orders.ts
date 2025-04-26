import highlight from '@src/infrastructure/prun-ui/css/table-row-highlight.module.css';
import { companyStore } from '@src/infrastructure/prun-api/data/company';

function onTileReady(tile: PrunTile) {
  const rows = tile.anchor.getElementsByTagName('tr');
  const processRows = () => {
    for (const row of Array.from(rows)) {
      if (row.firstChild?.textContent === companyStore.value?.name) {
        row.classList.add(highlight.highlight);
      } else {
        row.classList.remove(highlight.highlight);
      }
    }
  };
  processRows();
  const observer = new MutationObserver(processRows);
  observer.observe(tile.anchor, { childList: true, subtree: true, characterData: true });
}

function init() {
  tiles.observe('CXOB', onTileReady);
  tiles.observe('FXOB', onTileReady);
}

features.add(import.meta.url, init, 'Highlights own orders in CXOB and FXOB.');
