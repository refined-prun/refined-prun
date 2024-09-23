import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import { observeReadyElementsByTagName } from '@src/utils/mutation-observer';
import { computed } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { formatEta } from '@src/utils/format';
import { timestampEachSecond } from '@src/utils/dayjs';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';

function onTileReady(tile: PrunTile) {
  observeReadyElementsByTagName('tr', {
    baseElement: tile.frame,
    callback: onRowReady,
  });
}

function onRowReady(row: HTMLTableRowElement) {
  const id = refPrunId(row);
  const eta = computed(() => {
    const ship = shipsStore.getById(id.value);
    const flight = flightsStore.getById(ship?.flightId);
    if (!flight) {
      return undefined;
    }
    return ` (${formatEta(timestampEachSecond.value, flight.arrival.timestamp)})`;
  });

  const span = createReactiveSpan(row, eta);
  keepLast(row, () => row.children[7], span);
}

function init() {
  tiles.observe('FLT', onTileReady);
}

void features.add({
  id: 'flt-arrival-eta',
  init,
});
