import features from '@src/features/feature-registry';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.SectionList.button), buttons => {
    const demolish = buttons.children[1];
    demolish?.classList.add(C.Button.danger);
  });
}

function init() {
  tiles.observe('BBL', onTileReady);
}

features.add(import.meta.url, init, 'BBL: Applies the "danger" style to the "Demolish" button.');
