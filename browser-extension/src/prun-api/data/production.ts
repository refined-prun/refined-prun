import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { computed } from 'vue';

const store = createEntityStore<PrunApi.ProductionLine>();
const state = store.state;

messages({
  PRODUCTION_SITE_PRODUCTION_LINES(data: {
    siteId: string;
    productionLines: PrunApi.ProductionLine[];
  }) {
    store.setMany(data.productionLines);
  },
  PRODUCTION_ORDER_ADDED(data: PrunApi.ProductionOrder) {
    const line = state.entities[data.productionLineId];
    if (!line) {
      return;
    }

    state.entities[data.productionLineId] = {
      ...line,
      orders: [...line.orders, data],
    };
  },
  PRODUCTION_ORDER_UPDATED(data: PrunApi.ProductionOrder) {
    const line = state.entities[data.productionLineId];
    if (!line) {
      return;
    }

    state.entities[data.productionLineId] = {
      ...line,
      orders: line.orders.map(x => (x.id === data.id ? data : x)),
    };
  },
  PRODUCTION_ORDER_REMOVED(data: { orderId: string; productionLineId: string }) {
    const line = state.entities[data.productionLineId];
    if (!line) {
      return;
    }

    state.entities[data.productionLineId] = {
      ...line,
      orders: line.orders.filter(x => x.id !== data.orderId),
    };
  },
});

const bySiteId = computed(() => {
  const map = new Map<string, PrunApi.ProductionLine[]>();
  for (const line of state.all.value) {
    let lines = map.get(line.siteId);
    if (!lines) {
      lines = [];
      map.set(line.siteId, lines);
    }
    lines.push(line);
  }
  return map;
});

export const productionStore = {
  ...state,
  getBySiteId: (siteId?: string | null) => (siteId ? bySiteId.value.get(siteId) : undefined),
};
