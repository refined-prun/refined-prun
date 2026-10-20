import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import getMapArray from '@src/utils/get-map-array';
import { userDataStore } from '@src/infrastructure/prun-api/data/user-data';
import { KnapsackResult, solveKnapsack } from '@src/core/shipping/knapsack';
import {
  getAcceptableShippingAds,
  getShipFreeSpace,
  getShipReachableSystems,
  getSystemNaturalId,
  ShippingAd,
} from '@src/core/shipping/shipping-ads';

export interface ShipTrip {
  destination: string;
  outbound: KnapsackResult<ShippingAd>;
  inbound?: KnapsackResult<ShippingAd>;
  value: number;
}

// Trial players can't accept shipping contracts.
export function canAcceptContracts() {
  return userDataStore.subscriptionLevel === 'BASIC' || userDataStore.subscriptionLevel === 'PRO';
}

export function getShipTrips(ship: PrunApi.Ship, returnTrip: boolean) {
  const here = getEntityNaturalIdFromAddress(ship.address);
  const space = getShipFreeSpace(ship);
  const reachable = getShipReachableSystems(ship);
  if (ship.flightId || !here || !space || !reachable) {
    return undefined;
  }

  const isReachable = (location: string) => {
    const system = getSystemNaturalId(location);
    return location !== here && system !== undefined && reachable.has(system);
  };
  const outbound = groupBy(
    getAcceptableShippingAds('source', here).filter(x => isReachable(x.destination)),
    x => x.destination,
  );
  const inbound = returnTrip
    ? groupBy(
        getAcceptableShippingAds('destination', here).filter(x => isReachable(x.origin)),
        x => x.origin,
      )
    : new Map<string, ShippingAd[]>();

  const trips: ShipTrip[] = [];
  for (const destination of new Set([...outbound.keys(), ...inbound.keys()])) {
    const out = solveKnapsack(outbound.get(destination) ?? [], space.weight, space.volume);
    const back = inbound.has(destination)
      ? solveKnapsack(inbound.get(destination)!, space.weight, space.volume)
      : undefined;
    const value = out.value + (back?.value ?? 0);
    if (value > 0) {
      trips.push({ destination, outbound: out, inbound: back, value });
    }
  }
  return trips.sort((a, b) => b.value - a.value);
}

function groupBy<T>(items: T[], key: (x: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    getMapArray(map, key(item)).push(item);
  }
  return map;
}
