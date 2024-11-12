import features from '@src/feature-registry';

function onTileReady(tile: PrunTile) {
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

function init() {
  tiles.observe('CXPO', onTileReady);
}

features.add({
  id: 'cxpo-shorten-names',
  description: 'CXPO: Shortens values of "Exchange" and "Material" fields.',
  advanced: true,
  init,
});
