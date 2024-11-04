import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { refTextContent } from '@src/utils/reactive-dom';
import { computed, Ref } from 'vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { formatEta } from '@src/utils/format';
import { timestampEachSecond } from '@src/utils/dayjs';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$ } from '@src/utils/select-dom';

function onTileReady(tile: PrunTile) {
  const ship = computed(() => shipsStore.getByRegistration(tile.parameter));
  subscribe($$(tile.anchor, PrunCss.MissionPlan.table), x => onTableReady(x, ship));
}

function onTableReady(table: HTMLElement, ship: Ref<PrunApi.Ship | undefined>) {
  subscribe($$(table, 'tr'), x => onRowReady(x, ship));
}

function onRowReady(row: HTMLElement, ship: Ref<PrunApi.Ship | undefined>) {
  const firstColumn = refTextContent(row.children[0]);
  const arrival = computed(() => getFlightSegmentArrival(ship.value, firstColumn.value));
  const eta = computed(() =>
    arrival.value ? ` (${formatEta(timestampEachSecond.value, arrival.value)})` : undefined,
  );
  const span = createReactiveSpan(row, eta);
  keepLast(row, () => row.children[3], span);
}

function getFlightSegmentArrival(ship: PrunApi.Ship | undefined, index: string | null) {
  if (!ship || index === null) {
    return undefined;
  }

  let segments: PrunApi.FlightSegment[];

  if (ship.flightId) {
    const flight = flightsStore.getById(ship.flightId);
    if (!flight) {
      return undefined;
    }

    segments = flight.segments;
  } else {
    const plan = flightsStore.plan.value;
    if (!plan) {
      return undefined;
    }

    segments = plan.segments;
  }

  const segmentId = index !== '' ? parseInt(index, 10) : segments.length - 1;
  if (isFinite(segmentId) && segmentId < segments.length) {
    return segments[segmentId].arrival.timestamp;
  }

  return undefined;
}

function init() {
  tiles.observe('SFC', onTileReady);
}

features.add({
  id: 'sfc-arrival-eta',
  description: 'SFC: Adds an arrival date to the "Duration" column.',
  init,
});
