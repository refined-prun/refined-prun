import { ElementTag } from '@src/infrastructure/prun-ui/tagger';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { formatEta } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, ElementTag.FLT_ETA_CELL), onEtaCellReady);
}

function onEtaCellReady(cell: HTMLElement) {
  const row = cell.closest('tr')!;
  const id = refPrunId(row);
  const arrival = computed(() => {
    const ship = shipsStore.getById(id.value);
    const flight = flightsStore.getById(ship?.flightId);
    return flight?.arrival.timestamp;
  });
  const eta = computed(() =>
    arrival.value !== undefined
      ? ` (${formatEta(timestampEachMinute.value, arrival.value)})`
      : undefined,
  );
  const span = createReactiveSpan(cell, eta);
  keepLast(cell, () => cell, span);
}

function init() {
  tiles.observe(['FLT', 'FLTS', 'FLTP'], onTileReady);
}

features.add(import.meta.url, init, 'FLT: Adds an arrival date to the "ETA" column.');
