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
  notStoppedBurn: BurnValues | undefined;
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
          notStoppedBurn: calculatePlanetBurn(production, workforce, storage ?? [], false),
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
  includeStopped: boolean = true,
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
      let burnOrders = getRecurringOrders(line);

      if (!includeStopped) {
        burnOrders = transformStoppedOrders(burnOrders, storage);
      }

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

function transformStoppedOrders(
  orders: PrunApi.ProductionOrder[],
  storage: PrunApi.Store[] | undefined,
): PrunApi.ProductionOrder[] {
  let output = orders;

  const materialAmounts = new Map<string, number>();

  if (storage) {
    // Get total material stockpiles for each material
    for (const inventory of storage) {
      for (const item of inventory.items) {
        const quantity = item.quantity;
        if (!quantity) {
          continue;
        }
        materialAmounts.set(
          quantity.material.ticker,
          (materialAmounts.get(quantity.material.ticker) ?? 0) + quantity.amount,
        );
      }
    }
  }

  // Set stopped orders to 0% time, input, output
  output = output.map(order => {
    let outputOrder = order;
    const inputStocks = outputOrder.inputs.map(
      input => materialAmounts.get(input.material.ticker) ?? 0,
    );
    if (inputStocks.some((stock, idx) => stock < outputOrder.inputs[idx].amount)) {
      outputOrder = {
        ...outputOrder,
        halted: true,
        duration: {
          millis: 0,
        },
        inputs: outputOrder.inputs.map(input => {
          return {
            ...input,
            amount: 0.0000001,
          };
        }),
        outputs: outputOrder.outputs.map(output => {
          return {
            ...output,
            amount: 0,
            value: {
              ...output.value,
              amount: 0,
            },
          };
        }),
      };
    }
    return outputOrder;
  });

  return output;
}
