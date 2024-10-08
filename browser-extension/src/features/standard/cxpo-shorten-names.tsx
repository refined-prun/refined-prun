import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { $, $$ } from '@src/utils/select-dom';
import { subscribe } from '@src/utils/subscribe-async-generator';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.ComExPlaceOrderForm.form), form => {
    const parts = tile.parameter!.split('.');
    void replaceRowValue(form.children[0], parts[1]);
    void replaceRowValue(form.children[1], parts[0]);
  });
}

async function replaceRowValue(row: Element, value: string) {
  const label = await $(row, PrunCss.StaticInput.static);
  label.textContent = value;
}

export function init() {
  tiles.observe('CXPO', onTileReady);
}

void features.add({
  id: 'cxpo-shorten-names',
  init,
});
