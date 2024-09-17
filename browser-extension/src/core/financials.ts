import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { inventory } from '@src/core/balance/inventory';

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

  for (const [name, value] of inventory.byLocation.value) {
    const location = getLocation(name);
    location.current += value;
    location.total += value;
  }

  for (const [name, value] of currentAssets.orders.value) {
    const location = getLocation(name);
    location.current += value;
    location.total += value;
  }

  for (const [name, value] of nonCurrentAssets.buildings.value) {
    const location = getLocation(name);
    location.nonCurrent += value;
    location.total += value;
  }

  locations.sort((a, b) => b.total - a.total);
  return locations;
}
