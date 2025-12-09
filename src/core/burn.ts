import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { sumBy } from '@src/utils/sum-by';
import { getRecurringOrders } from '@src/core/orders';
import { userData } from '@src/store/user-data.ts';

export interface MaterialBurn {
  input: number;
  output: number;
  workforce: number;
  dailyAmount: number;
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
        const upkeeps = userData.upkeeps[id];
        if (!workforce || !production) {
          return undefined;
        }

        return {
          storeId: storage?.[0]?.id,
          planetName: getEntityNameFromAddress(site.address),
          naturalId: getEntityNaturalIdFromAddress(site.address),
          burn: calculatePlanetBurn(production, workforce, storage ?? [], upkeeps),
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
  upkeeps: UserData.Upkeep[] | undefined,
) {
  const burnValues: BurnValues = {};

  function getBurnValue(ticker: string) {
    if (burnValues[ticker] === undefined) {
      burnValues[ticker] = {
        input: 0,
        output: 0,
        workforce: 0,
        dailyAmount: 0,
        inventory: 0,
        daysLeft: 0,
        type: 'output',
      };
    }
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

  if (upkeeps) {
    for (const upkeep of upkeeps) {
      for (const matAmount of upkeep.matAmounts) {
        const materialBurn = getBurnValue(matAmount.material.ticker);
        if (matAmount.amount > 0) {
          materialBurn.output += matAmount.amount / (upkeep.duration.millis / 1000 / 60 / 60 / 24);
        } else {
          materialBurn.input += -matAmount.amount / (upkeep.duration.millis / 1000 / 60 / 60 / 24);
        }
      }
    }
  }

  for (const ticker of Object.keys(burnValues)) {
    const burnValue = burnValues[ticker];
    burnValue.dailyAmount = burnValue.output;
    burnValue.type = 'output';
    burnValue.dailyAmount -= burnValue.workforce;
    if (burnValue.workforce > 0 && burnValue.dailyAmount <= 0) {
      burnValue.type = 'workforce';
    }
    burnValue.dailyAmount -= burnValue.input;
    if (burnValue.input > 0 && burnValue.dailyAmount <= 0) {
      burnValue.type = 'input';
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
        if (quantity.amount != 0) {
          materialBurn.daysLeft =
            materialBurn.dailyAmount > 0
              ? 1000
              : Math.floor(-materialBurn.inventory / materialBurn.dailyAmount);
        }
      }
    }
  }

  return burnValues;
}
