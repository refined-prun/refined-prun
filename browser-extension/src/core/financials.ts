import { cxStore } from '@src/fio/cx';
import { setSettings } from '@src/util';
import system from '@src/system';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { balance } from '@src/core/balance/balance';
import { contractsStore } from '@src/prun-api/data/contracts';
import { inventory } from '@src/core/balance/inventory';

interface LocationAssets {
  name: string;
  current: number;
  nonCurrent: number;
  total: number;
}

// History stored as [time, fixed, current, liquid, liabilities]
export const finHistory: number[][] = [];

const storageKey = 'PMMG-Finance';

export async function loadFinHistory() {
  const savedSettings = await system.storage.local.get(storageKey);
  const savedHistory = savedSettings[storageKey]?.History ?? [];
  finHistory.length = 0;
  finHistory.push(...savedHistory);
}

async function saveFinHistory() {
  const savedSettings = await system.storage.local.get(storageKey);
  finHistory.push([
    Date.now(),
    Math.round(nonCurrentAssets.total.value * 100) / 100,
    Math.round(currentAssets.totalExceptLiquid.value * 100) / 100,
    Math.round(currentAssets.liquid.value * 100) / 100,
    Math.round(balance.totalLiabilities.value * 100) / 100,
  ]);
  savedSettings[storageKey].History = finHistory;
  await system.storage.local.set(savedSettings);
}

// Actually recording and processing the financials once they are received through BackgroundRunner.
export function recordFinancials(result) {
  if (!cxStore.fetched || !contractsStore.fetched) {
    window.setTimeout(() => recordFinancials(result), 50);
    return;
  }

  result['PMMGExtended']['last_fin_recording'] = Date.now();
  setSettings(result);

  void saveFinHistory();
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

  for (const [name, value] of nonCurrentAssets.buildings.value) {
    const location = getLocation(name);
    location.nonCurrent += value;
    location.total += value;
  }

  locations.sort((a, b) => b.total - a.total);
  return locations;
}
