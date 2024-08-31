import features from '@src/feature-registry';
import buffers from '@src/infrastructure/prun-ui/prun-buffers';
import {
  observeChildListChanged,
  observeReadyElementsByTagName,
} from '@src/utils/mutation-observer';
import { widgetAppend } from '@src/utils/vue-mount';
import ShipArrivalEta from './ShipArrivalEta.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { reactive } from 'vue';

function onBufferReady(buffer: PrunBuffer) {
  observeReadyElementsByTagName('tbody', {
    baseElement: buffer.frame,
    callback: onTableReady,
  });
}

function onTableReady(table: HTMLTableSectionElement) {
  observeReadyElementsByTagName('tr', {
    baseElement: table,
    callback: onRowReady,
  });
}

function onRowReady(row: HTMLTableRowElement) {
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

function init() {
  buffers.observe('FLT', onBufferReady);
}

void features.add({
  id: 'flt-arrival-eta',
  init,
});
