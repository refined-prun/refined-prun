import { computed } from 'vue';
import { sumMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { timestampEachMinute } from '@src/utils/dayjs';
import { clamp } from '@src/utils/clamp';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { sumMapValues } from '@src/core/balance/utils';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { productionStore } from '@src/infrastructure/prun-api/data/production';

interface Entry {
  location: string;
  order: PrunApi.ProductionOrder;
  inputs: number;
  outputs: number;
}

const orderValue = computed(() => {
  const orders: Entry[] = [];
  for (const site of sitesStore.all.value) {
    const location = getEntityNameFromAddress(site.address)!;
    const lines = productionStore.getBySiteId(site.siteId);
    if (!lines) {
      continue;
    }
    for (const line of lines) {
      for (const order of line.orders.filter(x => x.started)) {
        orders.push({
          location,
          order,
          inputs: sumMaterialAmountPrice(order.inputs) + order.productionFee.amount,
          outputs: sumMaterialAmountPrice(order.outputs),
        });
      }
    }
  }
  return orders;
});

export const currentOrderValue = computed(() => {
  const now = timestampEachMinute();
  const orders = new Map<string, number>();
  for (const order of orderValue.value) {
    const duration = order.order.duration!.millis;
    const elapsed = now - order.order.started!.timestamp;
    const t = clamp(elapsed / duration, 0, 1);
    const value = order.inputs * (1 - t) + order.outputs * t;
    if (value === 0) {
      continue;
    }
    orders.set(order.location, (orders.get(order.location) ?? 0) + value);
  }
  return orders;
});

export const totalOrderValue = computed(() => sumMapValues(currentOrderValue.value));
