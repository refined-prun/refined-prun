import { createFragmentApp } from '@src/utils/vue-fragment-app';
import OrderBook from './OrderBook.vue';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.ComExPlaceOrderForm.form), form => {
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
  });
}

function init() {
  tiles.observe('CXPO', onTileReady);
}

features.add({
  id: 'cxpo-order-book',
  description: 'CXPO: Adds a compact order book.',
  init,
});
