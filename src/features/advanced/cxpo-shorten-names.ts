import features from '@src/feature-registry';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ComExPlaceOrderForm.form), form => {
    const parts = tile.parameter!.split('.');
    void replaceRowValue(form.children[0], parts[1]);
    void replaceRowValue(form.children[1], parts[0]);
  });
}

async function replaceRowValue(row: Element, value: string) {
  const label = await $(row, C.StaticInput.static);
  label.textContent = value;
}

function init() {
  tiles.observe('CXPO', onTileReady);
}

features.add(import.meta.url, init, 'CXPO: Shortens values of "Exchange" and "Material" fields.');
