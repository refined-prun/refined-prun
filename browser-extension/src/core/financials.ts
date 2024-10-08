import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { inventory } from '@src/core/balance/inventory';
import { workInProgressByLocation } from '@src/core/balance/orders';

interface LocationAssets {
  name: string;
  current: number;
  nonCurrent: number;
  total: number;
}

export function calculateLocationAssets() {
  const locations: LocationAssets[] = [];

  function getLocation(name: string) {
    let location = locations.find(x => x.name === name);
    if (!location) {
      location = {
        name,
        current: 0,
        nonCurrent: 0,
        total: 0,
      };
      locations.push(location);
    }
    return location;
  }

  if (inventory.byLocation.value === undefined) {
    return undefined;
  }
  for (const [name, value] of inventory.byLocation.value) {
    const location = getLocation(name);
    location.current += value;
    location.total += value;
  }

  if (workInProgressByLocation.value === undefined) {
    return undefined;
  }
  for (const [name, value] of workInProgressByLocation.value) {
    const location = getLocation(name);
    location.current += value;
    location.total += value;
  }

  if (nonCurrentAssets.buildingsNetValueByLocation.value === undefined) {
    return undefined;
  }
  for (const [name, value] of nonCurrentAssets.buildingsNetValueByLocation.value) {
    const location = getLocation(name);
    location.nonCurrent += value;
    location.total += value;
  }

  locations.sort((a, b) => b.total - a.total);
  return locations;
}
