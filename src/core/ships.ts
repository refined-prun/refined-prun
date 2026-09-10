import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';

const shipsByDestination = computed(() => {
  const map = new Map<string, PrunApi.Ship[]>();
  const add = (address: PrunApi.Address | undefined, ship: PrunApi.Ship) => {
    const key = getEntityNaturalIdFromAddress(address);
    if (!key) {
      return;
    }
    let list = map.get(key);
    if (!list) {
      list = [];
      map.set(key, list);
    }
    list.push(ship);
  };
  for (const flight of flightsStore.all.value ?? []) {
    const ship = shipsStore.getById(flight.shipId);
    if (!ship) {
      continue;
    }
    add(flight.destination, ship);
  }
  for (const ship of shipsStore.all.value ?? []) {
    if (ship.flightId || !ship.address) {
      continue;
    }
    add(ship.address, ship);
  }
  return map;
});

export function findShipsByDestination(destination?: PrunApi.Address) {
  if (!destination) {
    return undefined;
  }

  const key = getEntityNaturalIdFromAddress(destination);
  if (!key) {
    return undefined;
  }

  return shipsByDestination.value.get(key);
}
