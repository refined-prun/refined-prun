import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import {
  observeChildListChanged,
  observeReadyElementsByTagName,
} from '@src/utils/mutation-observer';
import { widgetAppend } from '@src/utils/vue-mount';
import ShipArrivalEta from './ShipArrivalEta.vue';
import { refTextContent } from '@src/utils/reactive-dom';
import { reactive } from 'vue';

function onTileReady(tile: PrunTile) {
  observeReadyElementsByTagName('tbody', {
    baseElement: tile.frame,
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
  tiles.observe('FLT', onTileReady);
}

void features.add({
  id: 'flt-arrival-eta',
  init,
});
