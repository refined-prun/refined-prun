import { State } from '@src/prun-api/data/store';
import { selectProductionLinesBySiteId } from '@src/prun-api/data/production';
import { selectWorkforceBySiteId } from '@src/prun-api/data/workforces';
import { selectStorageByAddress } from '@src/prun-api/data/storage';
import { showBuffer } from '@src/util';
import { createSelector } from '@reduxjs/toolkit';
import { selectSiteById } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress, getPlanetNaturalIdFromAddress } from '@src/prun-api/data/addresses';

export interface MaterialBurn {
  DailyAmount: number;
  Inventory: number;
  DaysLeft: number;
  Type: 'input' | 'output' | 'workforce';
}

export interface BurnValues {
  [ticker: string]: MaterialBurn;
}

export interface PlanetBurn {
  planetName: string;
  burn: BurnValues;
}

const requestedData: Set<string> = new Set();

export function createBurnSelector(siteOrId: PrunApi.Site | string) {
  const id = typeof siteOrId === 'string' ? siteOrId : siteOrId.siteId;
  return createSelector(
    (state: State) => selectSiteById(state, id),
    (state: State) => selectWorkforceBySiteId(state, id),
    (state: State) => selectProductionLinesBySiteId(state, id),
    (state: State) => selectStorageByAddress(state, id),
    (site, workforce, production, storage) => {
      if (!workforce || !production) {
        if (!requestedData.has(site.siteId)) {
          requestedData.add(site.siteId);
          const naturalId = getPlanetNaturalIdFromAddress(site.address);
          showBuffer(`BS ${naturalId}`, true, true);
        }
        return undefined;
      }

      return {
        planetName: getPlanetNameFromAddress(site.address),
        burn: calc(production, workforce, storage ?? []),
      } as PlanetBurn;
    },
  );
}

function calc(production: PrunApi.ProductionLine[], workforces: PrunApi.Workforce[], storage: PrunApi.Store[]) {
  const burnDict: BurnValues = {};

  for (const line of production) {
    const numLines = line.capacity;
    let hasRecurring = false;
    let totalDuration = 0;
    for (const order of line.orders) {
      if (!order.started) {
        // Only account for orders in the queue.
        hasRecurring = hasRecurring || order.recurring;
      }
    }
    for (const order of line.orders) {
      if (!order.started && (!hasRecurring || order.recurring)) {
        // Only account for orders in the queue.
        totalDuration += order.duration.millis;
      }
    }
    totalDuration /= 86400000; // Convert to days

    for (const order of line.orders) {
      if (!order.started && (!hasRecurring || order.recurring)) {
        for (const mat of order.outputs) {
          const materialBurn = burnDict[mat.material.ticker];
          if (materialBurn) {
            materialBurn.DailyAmount += (mat.amount * numLines) / totalDuration;
          } else {
            burnDict[mat.material.ticker] = {
              DailyAmount: (mat.amount * numLines) / totalDuration,
              Inventory: 0,
              DaysLeft: 0,
              Type: 'output',
            };
          }
        }
        for (const mat of order.inputs) {
          const materialBurn = burnDict[mat.material.ticker];
          if (materialBurn) {
            materialBurn.DailyAmount -= (mat.amount * numLines) / totalDuration;
            if (materialBurn.Type == 'output') {
              materialBurn.Type = 'input';
            }
          } else {
            burnDict[mat.material.ticker] = {
              DailyAmount: (-mat.amount * numLines) / totalDuration,
              Inventory: 0,
              DaysLeft: 0,
              Type: 'input',
            };
          }
        }
      }
    }
  }

  for (const tier of workforces) {
    if (tier.population <= 1) {
      // Don't count the bugged workforce with one population.
      continue;
    }
    for (const need of tier.needs) {
      const ticker = need.material.ticker;
      const materialBurn = burnDict[ticker];
      if (materialBurn) {
        materialBurn.DailyAmount -= need.unitsPerInterval;
        materialBurn.Type = 'workforce';
      } else {
        burnDict[ticker] = {
          DailyAmount: -need.unitsPerInterval,
          Inventory: 0,
          DaysLeft: 0,
          Type: 'workforce',
        };
      }
    }
  }

  for (const inventory of storage) {
    for (const item of inventory.items) {
      const materialBurn = burnDict[item.quantity.material.ticker];
      if (!materialBurn) {
        continue;
      }
      materialBurn.Inventory += item.quantity.amount;
      if (item.quantity.amount != 0) {
        materialBurn.DaysLeft =
          materialBurn.DailyAmount > 0 ? 1000 : Math.floor(-materialBurn.Inventory / materialBurn.DailyAmount);
      }
    }
  }

  return burnDict;
}
