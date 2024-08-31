import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { _$$ } from '@src/utils/get-element-by-class-name';
import { widgetAppend } from '@src/utils/vue-mount';
import OrderBook from './OrderBook.vue';

async function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.parameter) {
    return;
  }

  const form = await descendantPresent(buffer.frame, PrunCss.ComExPlaceOrderForm.form);
  const formParent = form.parentElement!;
  formParent.style.display = 'flex';
  form.style.flex = '1';
  for (const label of _$$(PrunCss.FormComponent.label, form)) {
    (label as HTMLLabelElement).style.minWidth = '95px';
  }
  for (const span of _$$(PrunCss.Tooltip.container, form)) {
    span.setAttribute('data-tooltip-position', 'right');
  }

  widgetAppend(formParent, OrderBook, { ticker: buffer.parameter });
}

export function init() {
  buffers.observe('CXPO', onBufferCreated);
}

void features.add({
  id: 'cxpo-order-book',
  init,
});
