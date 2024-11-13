import { refTextContent } from '@src/utils/reactive-dom';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { formatEta } from '@src/utils/format';
import { timestampEachSecond } from '@src/utils/dayjs';
import { createReactiveSpan } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';

function onTileReady(tile: PrunTile) {
  const ship = computed(() => shipsStore.getByRegistration(tile.parameter));
  subscribe($$(tile.anchor, C.MissionPlan.table), x => onTableReady(x, ship));
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

features.add(import.meta.url, init, 'SFC: Adds an arrival date to the "Duration" column.');