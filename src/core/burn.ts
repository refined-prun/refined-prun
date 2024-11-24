import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { sumBy } from '@src/utils/sum-by';
import { isEmpty } from 'ts-extras';

export interface MaterialBurn {
  input: number;
  output: number;
  workforce: number;
  DailyAmount: number;
  Inventory: number;
  DaysLeft: number;
  Type: 'input' | 'output' | 'workforce';
}

export interface BurnValues {
  [ticker: string]: MaterialBurn;
}

export interface PlanetBurn {
  storeId: string;
  planetName: string;
  naturalId: string;
  burn: BurnValues;
}

const burnBySiteId = computed(() => {
  if (sitesStore.all.value === undefined) {
    return undefined;
  }

  const bySiteId = new Map<string, Ref<PlanetBurn | undefined>>();
  for (const site of sitesStore.all.value) {
    bySiteId.set(
      site.siteId,
      computed(() => {
        const id = site.siteId;
        const workforce = workforcesStore.getById(id)?.workforces;
        const production = productionStore.getBySiteId(id);
        const storage = storagesStore.getByAddressableId(id);
        if (!workforce || !production) {
          return undefined;
        }

        return {
          storeId: storage?.[0]?.id,
          planetName: getEntityNameFromAddress(site.address),
          naturalId: getEntityNaturalIdFromAddress(site.address),
          burn: calculatePlanetBurn(production, workforce, storage ?? []),
        } as PlanetBurn;
      }),
    );
  }
  return bySiteId;
});

export function getPlanetBurn(siteOrId?: PrunApi.Site | string | null) {
  const site = typeof siteOrId === 'string' ? sitesStore.getById(siteOrId) : siteOrId;
  if (!site) {
    return undefined;
  }

  return burnBySiteId.value?.get(site.siteId)?.value;
}

export function calculatePlanetBurn(
  production: PrunApi.ProductionLine[] | undefined,
  workforces: PrunApi.Workforce[] | undefined,
  storage: PrunApi.Store[] | undefined,
) {
  const burnValues: BurnValues = {};

  function getBurnValue(ticker: string) {
    let burnValue = burnValues[ticker];
    if (!burnValue) {
      burnValue = {
        input: 0,
        output: 0,
        workforce: 0,
        DailyAmount: 0,
        Inventory: 0,
        DaysLeft: 0,
        Type: 'output',
      };
      burnValues[ticker] = burnValue;
    }
    return burnValue;
  }

  if (production) {
    for (const line of production) {
      const capacity = line.capacity;
      const queuedOrders = line.orders.filter(x => !x.started);
      const recurringOrders = queuedOrders.filter(x => x.recurring);
      const burnOrders = isEmpty(recurringOrders) ? queuedOrders : recurringOrders;
      let totalDuration = sumBy(burnOrders, x => x.duration?.millis ?? Infinity);
      // Convert to days
      totalDuration /= 86400000;

      for (const order of burnOrders) {
        for (const mat of order.outputs) {
          const materialBurn = getBurnValue(mat.material.ticker);
          materialBurn.output += (mat.amount * capacity) / totalDuration;
        }
        for (const mat of order.inputs) {
          const materialBurn = getBurnValue(mat.material.ticker);
          materialBurn.input += (mat.amount * capacity) / totalDuration;
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
      if (tier.capacity === 0) {
        // After demolishing housing, you can get homeless pops that don't consume goods.
        continue;
      }
      for (const need of tier.needs) {
        const materialBurn = getBurnValue(need.material.ticker);
        materialBurn.workforce += need.unitsPerInterval;
      }
    }
  }

  for (const ticker of Object.keys(burnValues)) {
    const burnValue = burnValues[ticker];
    burnValue.DailyAmount = burnValue.output;
    burnValue.Type = 'output';
    burnValue.DailyAmount -= burnValue.workforce;
    if (burnValue.workforce > 0 && burnValue.DailyAmount <= 0) {
      burnValue.Type = 'workforce';
    }
    burnValue.DailyAmount -= burnValue.input;
    if (burnValue.input > 0 && burnValue.DailyAmount <= 0) {
      burnValue.Type = 'input';
    }
  }

  if (storage) {
    for (const inventory of storage) {
      for (const item of inventory.items) {
        const quantity = item.quantity;
        if (!quantity) {
          continue;
        }
        const materialBurn = burnValues[quantity.material.ticker];
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

  return burnValues;
}
