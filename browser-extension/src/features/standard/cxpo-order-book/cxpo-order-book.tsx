import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { _$$ } from '@src/utils/get-element-by-class-name';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import OrderBook from './OrderBook.vue';

async function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  const form = await descendantPresent(tile.frame, PrunCss.ComExPlaceOrderForm.form);
  const formParent = form.parentElement!;
  formParent.style.display = 'flex';
  form.style.flex = '1';
  for (const label of _$$(PrunCss.FormComponent.label, form)) {
    (label as HTMLLabelElement).style.minWidth = '95px';
  }
  for (const span of _$$(PrunCss.Tooltip.container, form)) {
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
