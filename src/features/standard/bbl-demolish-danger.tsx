import features from '@src/feature-registry';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.SectionList.button), buttons => {
    const demolish = buttons.children[1];
    demolish?.classList.add(C.Button.danger);
  });
}

function init() {
  tiles.observe('BBL', onTileReady);
}

features.add({
  id: 'bbl-demolish-danger',
  description: 'BBL: Applies the "danger" style to the "Demolish" button.',
  init,
});
