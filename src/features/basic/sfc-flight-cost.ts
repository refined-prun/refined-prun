import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { flightPlansStore } from '@src/infrastructure/prun-api/data/flight-plans';
import { getPrice } from '@src/infrastructure/fio/cx';
import { formatCurrency } from '@src/utils/format';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { keepLast } from '@src/utils/keep-last';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { ElementTag } from '@src/infrastructure/prun-ui/tagger';

function onTileReady(tile: PrunTile) {
  const ship = computed(() => shipsStore.getByRegistration(tile.parameter));
  subscribe($$(tile.anchor, C.MissionPlan.table), x => onTableReady(x, ship));
}

function onTableReady(table: HTMLElement, ship: Ref<PrunApi.Ship | undefined>) {
  const planId = refPrunId(table);
  const fuelCost = computed(() => getFuelCost(ship.value, planId.value));
  const text = computed(() => {
    if (fuelCost.value === undefined) {
      return undefined;
    }
    if (ship.value?.flightId) {
      return `Cost:\n${formatCurrency(fuelCost.value)}`;
    }

    const fees = flightPlansStore.getById(planId.value)?.costs;
    if (!fees || fees.length === 0) {
      return `Cost:\n${formatCurrency(fuelCost.value)}`;
    }

    const cost = fuelCost.value + sumBy(fees, x => x.amount);
    return `Cost + Fees:\n${formatCurrency(cost)}`;
  });

  subscribe($$(table, C.MissionPlan.stats), stats => {
    subscribe($$(stats, ElementTag.SFC_CONSUMPTION_CELL), cell => {
      const div = createReactiveDiv(cell, text);
      div.style.whiteSpace = 'pre-wrap';
      keepLast(cell, () => cell, div);
    });
  });
}

function getFuelCost(ship: PrunApi.Ship | undefined, planId: string | null) {
  const segments = getSegments(ship, planId);
  if (segments === undefined) {
    return undefined;
  }

  let sf = 0;
  let ff = 0;
  for (const segment of segments) {
    sf += segment.stlFuelConsumption ?? 0;
    ff += segment.ftlFuelConsumption ?? 0;
  }

  const sfCost = getFuelTypeCost('SF', sf);
  const ffCost = getFuelTypeCost('FF', ff);
  if (sfCost === undefined || ffCost === undefined) {
    return undefined;
  }

  return sfCost + ffCost;
}

function getFuelTypeCost(ticker: string, amount: number) {
  if (amount === 0) {
    return 0;
  }

  const price = getPrice(ticker);
  return price === undefined ? undefined : amount * price;
}

function getSegments(ship: PrunApi.Ship | undefined, planId: string | null) {
  if (!ship) {
    return undefined;
  }

  if (ship.flightId) {
    return flightsStore.getById(ship.flightId)?.segments;
  }

  return flightPlansStore.getById(planId)?.segments;
}

function init() {
  tiles.observe('SFC', onTileReady);
}

features.add(import.meta.url, init, 'SFC: Shows flight cost, including fees and fuel.');
