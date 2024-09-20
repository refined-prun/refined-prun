import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';

export function calculateSiteProfitability(siteId: string) {
  const production = productionStore.getBySiteId(siteId);
  const workforce = workforcesStore.getById(siteId);
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

  let isRecurring = false;
  const msInADay = 86400000;

  if (production !== undefined) {
    isRecurring = production.some(x => x.orders.some(y => y.recurring));

    for (const line of production) {
      let totalDuration = 0;
      for (const order of line.orders) {
        if (!order.started && (!isRecurring || order.recurring)) {
          totalDuration += order.duration?.millis || Infinity;
        }
      }

      for (const order of line.orders) {
        if (!order.started && (!isRecurring || order.recurring)) {
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
  }

  const consumed = sumMaterialAmountPrice(inputs);
  const produced = sumMaterialAmountPrice(outputs);

  if (produced === undefined || consumed === undefined) {
    return undefined;
  }

  const profit = produced - consumed;
  const margin = consumed !== 0 ? profit / consumed : 0;
  return {
    produced,
    consumed,
    profit,
    margin,
  };
}
