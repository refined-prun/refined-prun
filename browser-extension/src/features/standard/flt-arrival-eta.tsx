import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { formatEta } from '@src/utils/format';
import { timestampEachSecond } from '@src/utils/dayjs';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tr'), onRowReady);
}

function onRowReady(row: HTMLTableRowElement) {
  const id = refPrunId(row);
  const arrival = computed(() => {
    const ship = shipsStore.getById(id.value);
    const flight = flightsStore.getById(ship?.flightId);
    return flight?.arrival.timestamp;
  });
  const eta = computed(() =>
    arrival.value ? ` (${formatEta(timestampEachSecond.value, arrival.value)})` : undefined,
  );
  const span = createReactiveSpan(row, eta);
  keepLast(row, () => row.children[7], span);
}

function init() {
  tiles.observe('FLT', onTileReady);
}

features.add({
  id: 'flt-arrival-eta',
  description: 'FLT: Adds an arrival date to the "ETA" column.',
  init,
});
