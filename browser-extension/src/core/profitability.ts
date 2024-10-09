import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { sumBy } from '@src/utils/sum-by';
import { mergeMaterialAmounts } from '@src/core/sort-materials';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { calcBuildingMarketValue, isRepairableBuilding } from '@src/core/buildings';

export interface ProfitabilityEntry {
  name: string;
  cost: number;
  repairs: number;
  revenue: number;
  profit: number;
  margin: number;
}

export function calculateSiteProfitability(site: PrunApi.Site): ProfitabilityEntry | undefined {
  const production = productionStore.getBySiteId(site.siteId);
  const workforce = workforcesStore.getById(site.siteId);
  const inputs: PrunApi.MaterialAmount[] = [];
  const outputs: PrunApi.MaterialAmount[] = [];

  if (workforce === undefined) {
    return undefined;
  }

  for (const need of workforce.workforces.flatMap(x => x.needs)) {
    inputs.push({
      material: need.material,
      amount: need.unitsPerInterval,
    });
  }

  const msInADay = 86400000;

  if (production !== undefined) {
    const isRecurring = production.some(x => x.orders.some(y => y.recurring));

    for (const line of production) {
      const queuedOrders = line.orders.filter(x => !x.started && (!isRecurring || x.recurring));
      const totalDuration = sumBy(queuedOrders, x => x.duration?.millis ?? Infinity);

      for (const order of queuedOrders) {
        for (const mat of order.inputs) {
          inputs.push({
            material: mat.material,
            amount: (mat.amount * line.capacity * msInADay) / totalDuration,
          });
        }

        for (const mat of order.outputs) {
          outputs.push({
            material: mat.material,
            amount: (mat.amount * line.capacity * msInADay) / totalDuration,
          });
        }
      }
    }
  }

  const cost = sumMaterialAmountPrice(mergeMaterialAmounts(inputs));
  const revenue = sumMaterialAmountPrice(mergeMaterialAmounts(outputs));

  if (revenue === undefined || cost === undefined) {
    return undefined;
  }

  let repairs = 0;
  const oneDayDegradation = 1 / 180;
  const calculatedMarketValue = new Map<string, number>();
  for (const building of site.platforms) {
    if (!isRepairableBuilding(building) || building.condition === 0) {
      continue;
    }

    const ticker = building.module.reactorTicker;
    let marketValue = calculatedMarketValue.get(ticker);
    if (marketValue === undefined) {
      marketValue = calcBuildingMarketValue(building, site);
      if (marketValue === undefined) {
        return undefined;
      }
      calculatedMarketValue.set(ticker, marketValue);
    }
    repairs += marketValue * oneDayDegradation;
  }

  const totalCost = cost + repairs;
  const profit = revenue - totalCost;
  const margin = totalCost !== 0 ? profit / totalCost : 1;
  return {
    name: getEntityNameFromAddress(site.address)!,
    cost,
    repairs,
    revenue,
    profit,
    margin,
  };
}
