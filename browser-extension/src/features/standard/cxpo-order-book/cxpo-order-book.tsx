import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import OrderBook from './OrderBook.vue';
import { $, $$ } from '@src/utils/select-dom';

async function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  const form = await $(tile.frame, PrunCss.ComExPlaceOrderForm.form);
  const formParent = form.parentElement!;
  formParent.style.display = 'flex';
  form.style.flex = '1';
  for (const label of $$(form, PrunCss.FormComponent.label)) {
    (label as HTMLLabelElement).style.minWidth = '95px';
  }
  for (const span of $$(form, PrunCss.Tooltip.container)) {
    span.setAttribute('data-tooltip-position', 'right');
  }

  createFragmentApp(OrderBook, { ticker: tile.parameter }).appendTo(formParent);
}

export function init() {
  tiles.observe('CXPO', onTileReady);
}

void features.add({
  id: 'cxpo-order-book',
  init,
});
