import { createFragmentApp } from '@src/utils/vue-fragment-app';
import OrderBook from './OrderBook.vue';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, C.ComExPlaceOrderForm.form), form => {
    const formParent = form.parentElement!;
    formParent.style.display = 'flex';
    form.style.flex = '1';
    for (const label of _$$(form, C.FormComponent.label)) {
      (label as HTMLLabelElement).style.minWidth = '95px';
    }
    for (const span of _$$(form, C.Tooltip.container)) {
      span.setAttribute('data-tooltip-position', 'right');
    }

    createFragmentApp(OrderBook, { ticker: tile.parameter }).appendTo(formParent);
  });
}

function init() {
  tiles.observe('CXPO', onTileReady);
}

features.add(import.meta.url, init, 'CXPO: Adds a compact order book.');
