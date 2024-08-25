import { productionStore } from '@src/prun-api/data/production';
import { workforcesStore } from '@src/prun-api/data/workforces';
import { getPrice } from '@src/fio/cx';

export function calculateSiteProfitability(siteId: string) {
  const production = productionStore.getBySiteId(siteId);
  const workforce = workforcesStore.getById(siteId);
  const inputs: PrunApi.MaterialAmount[] = [];
  const outputs: PrunApi.MaterialAmount[] = [];

  if (workforce) {
    for (const need of workforce.workforces.flatMap(x => x.needs)) {
      inputs.push({
        material: need.material,
        amount: need.unitsPerInterval,
      });
    }
  }

  let isRecurring = false;
  const msInADay = 86400000;

  if (production) {
    isRecurring = production.some(x => x.orders.some(y => y.recurring));

    for (const line of production) {
      let totalDuration = 0;
      for (const order of line.orders) {
        if (!order.started && (!isRecurring || order.recurring)) {
          totalDuration += order.duration.millis || Infinity;
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

  let consumed = 0;
  for (const input of inputs) {
    consumed += getPrice(input.material.ticker) * input.amount;
  }

  let produced = 0;
  for (const output of outputs) {
    produced += getPrice(output.material.ticker) * output.amount;
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
