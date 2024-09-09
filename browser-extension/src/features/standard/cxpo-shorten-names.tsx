import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { _$ } from '@src/utils/get-element-by-class-name';

async function onTileReady(tile: PrunTile) {
  const form = await descendantPresent(tile.frame, PrunCss.ComExPlaceOrderForm.form);
  const parts = tile.parameter!.split('.');
  replaceRowValue(form.children[0], parts[1]);
  replaceRowValue(form.children[1], parts[0]);
}

function replaceRowValue(row: Element, value: string) {
  const label = _$(PrunCss.StaticInput.static, row);
  if (label) {
    label.textContent = value;
  }
}

export function init() {
  tiles.observe('CXPO', onTileReady);
}

void features.add({
  id: 'cxpo-shorten-names',
  init,
});
