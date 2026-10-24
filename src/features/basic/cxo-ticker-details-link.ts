import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { openTickerDetails } from '@src/features/XIT/CXOS/multi-buffer';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.Link.link), link => {
    const text = link.textContent?.trim();
    if (!text) {
      return;
    }

    const dotIndex = text.indexOf('.');
    if (dotIndex < 0) {
      return;
    }

    const ticker = text.substring(0, dotIndex);
    const exchange = text.substring(dotIndex + 1);
    if (!materialsStore.getByTicker(ticker)) {
      return;
    }

    link.addEventListener('click', e => {
      void openTickerDetails(ticker, exchange);
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

function init() {
  tiles.observe('CXO', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'CXO: Opens the ticker.exchange link as the XIT CXOS details view instead of CXP.',
);
