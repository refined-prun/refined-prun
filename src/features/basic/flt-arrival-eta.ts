import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { formatEta } from '@src/utils/format';
import { keepLast } from '@src/utils/keep-last';
import { createReactiveSpan } from '@src/utils/reactive-element';

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
    arrival.value ? ` (${formatEta(Date.now(), arrival.value)})` : undefined,
  );
  const span = createReactiveSpan(row, eta);
  keepLast(row, () => row.children[7], span);
}

function init() {
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Adds an arrival date to the "ETA" column.');
