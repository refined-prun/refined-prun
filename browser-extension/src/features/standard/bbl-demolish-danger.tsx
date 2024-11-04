import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.SectionList.button), buttons => {
    const demolish = buttons.children[1];
    demolish?.classList.add(PrunCss.Button.danger);
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
