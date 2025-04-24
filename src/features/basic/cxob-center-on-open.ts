import features from '@src/features/feature-registry';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ScrollView.view), scroll => {
    subscribe($$(scroll, 'table'), async table => {
      const spread = await $(table, C.ComExOrderBookPanel.spread);
      const spreadRect = spread.getBoundingClientRect();
      scroll.scrollTop = Math.max(
        spread.offsetTop - scroll.clientHeight / 2 + spreadRect.height / 2,
        0,
      );
    });
  });
}

function init() {
  tiles.observe('CXOB', onTileReady);
}

features.add(import.meta.url, init, 'CXOB: Centers the order book on open.');
