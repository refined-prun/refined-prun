import { $ } from 'select-dom';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import { observeChildListChanged, observeChildren } from '@src/utils/mutation-observer';
import { widgetAppend } from '@src/utils/vue-mount';
import ShipArrivalEta from '@src/features/flt-arrival-eta/ShipArrivalEta.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { reactive } from 'vue';

function observeBuffer(frame: HTMLDivElement) {
  const tbody = $('table > tbody', frame);
  if (tbody === undefined) {
    if (frame.isConnected) {
      requestAnimationFrame(() => observeBuffer(frame));
    }
    return;
  }

  observeChildren(tbody, observeRow);
}

function observeRow(row: Node) {
  if (!(row instanceof HTMLTableRowElement)) {
    return;
  }

  const etaColumn = row.children[7];
  const { instance } = widgetAppend(
    etaColumn,
    ShipArrivalEta,
    reactive({
      shipRegistration: refTextContent(row.children[0]),
    }),
  );
  observeChildListChanged(etaColumn, () => {
    if (etaColumn.lastChild !== instance.$el) {
      etaColumn.appendChild(instance.$el);
    }
  });
}

function onBufferCreated(buffer: PrunBuffer) {
  observeBuffer(buffer.frame);
}

function init() {
  buffers.observe('FLT', onBufferCreated);
}

void features.add({
  id: 'flt-arrival-eta',
  init,
});
