import { createFragmentApp } from '@src/utils/vue-fragment-app';
import OrderBook from './OrderBook.vue';
import { changeInputValue } from '@src/util';
import { increaseDefaultBufferSize } from '@src/infrastructure/prun-ui/buffer-sizes';

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

    const dynamicInputs = _$$(form, 'input');

    function onOrderClick(price: number, quantity?: number) {
      changeInputValue(dynamicInputs[1], price.toString());
      if (quantity !== undefined) {
        changeInputValue(dynamicInputs[0], quantity.toString());
      }
    }

    createFragmentApp(OrderBook, { ticker: tile.parameter, onOrderClick }).appendTo(formParent);
  });
}

function init() {
  increaseDefaultBufferSize('CXPO', { width: 60 });
  tiles.observe('CXPO', onTileReady);
}

features.add(import.meta.url, init, 'CXPO: Adds a compact order book.');
