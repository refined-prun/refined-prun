import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { getRecurringOrders } from '@src/core/orders';

export interface MaterialBurn {
  input: number;
  output: number;
  workforce: number;
  dailyAmount: number;
  remainingAllocation: number;
  inventory: number;
  daysLeft: number;
  type: 'input' | 'output' | 'workforce';
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
  if (!sitesStore.all.value) {
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

  function getBurnValue(material: PrunApi.Material) {
    const ticker = material.ticker;
    burnValues[ticker] ??= {
      input: 0,
      output: 0,
      workforce: 0,
      dailyAmount: 0,
      remainingAllocation: 0,
      inventory: 0,
      daysLeft: 0,
      type: 'output',
    };
    return burnValues[ticker];
  }

  if (production) {
    for (const line of production) {
      const capacity = line.capacity;
      const burnOrders = getRecurringOrders(line);
      let totalDuration = sumBy(burnOrders, x => x.duration?.millis ?? Infinity);
      // Convert to days
      totalDuration /= 86400000;

      for (const order of burnOrders) {
        for (const amount of order.outputs) {
          getBurnValue(amount.material).output += (amount.amount * capacity) / totalDuration;
        }
        for (const amount of order.inputs) {
          getBurnValue(amount.material).input += (amount.amount * capacity) / totalDuration;
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
        const mat = getBurnValue(need.material);
        mat.workforce += need.unitsPerInterval;
        mat.remainingAllocation = need.remainingAllocation;
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
        const materialBurn = burnValues[quantity.material.ticker];
        if (materialBurn === undefined) {
          continue;
        }
        materialBurn.inventory += quantity.amount;
      }
    }
  }

  for (const ticker in burnValues) {
    const mat = burnValues[ticker];
    mat.dailyAmount = mat.output;
    mat.type = 'output';
    mat.dailyAmount -= mat.workforce;
    if (mat.workforce > 0 && mat.dailyAmount <= 0) {
      mat.type = 'workforce';
    }
    mat.dailyAmount -= mat.input;
    if (mat.input > 0 && mat.dailyAmount <= 0) {
      mat.type = 'input';
    }
    const inv = mat.remainingAllocation + mat.inventory;
    mat.daysLeft = mat.dailyAmount >= 0 ? Number.POSITIVE_INFINITY : inv / -mat.dailyAmount;
  }

  return burnValues;
}
