import { productionStore } from '@src/prun-api/data/production';
import { workforcesStore } from '@src/prun-api/data/workforces';
import { storagesStore } from '@src/prun-api/data/storage';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';

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

export function getPlanetBurn(siteOrId: PrunApi.Site | string) {
  const site = typeof siteOrId === 'string' ? sitesStore.getById(siteOrId)! : siteOrId;
  const id = site.siteId;
  const workforce = workforcesStore.getById(id)?.workforces;
  const production = productionStore.getBySiteId(id);
  const storage = storagesStore.getByAddress(id);
  if (!workforce || !production) {
    return undefined;
  }

  return {
    planetName: getPlanetNameFromAddress(site.address),
    burn: calculatePlanetBurn(production, workforce, storage ?? []),
  } as PlanetBurn;
}

export function calculatePlanetBurn(
  production: PrunApi.ProductionLine[] | undefined,
  workforces: PrunApi.Workforce[] | undefined,
  storage: PrunApi.Store[] | undefined,
) {
  const burnDict: BurnValues = {};

  if (production) {
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
          totalDuration += order.duration?.millis || Infinity;
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
  }

  if (workforces) {
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
  }

  if (storage) {
    for (const inventory of storage) {
      for (const item of inventory.items) {
        const quantity = item.quantity;
        if (!quantity) {
          continue;
        }
        const materialBurn = burnDict[quantity.material.ticker];
        if (!materialBurn) {
          continue;
        }
        materialBurn.Inventory += quantity.amount;
        if (quantity.amount != 0) {
          materialBurn.DaysLeft =
            materialBurn.DailyAmount > 0
              ? 1000
              : Math.floor(-materialBurn.Inventory / materialBurn.DailyAmount);
        }
      }
    }
  }

  return burnDict;
}