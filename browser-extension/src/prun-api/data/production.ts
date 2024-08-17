import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { createGroupMapGetter } from '@src/prun-api/data/create-map-getter';
import { createRequestGetter, request } from '@src/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.ProductionLine>();
const state = store.state;

messages({
  PRODUCTION_SITE_PRODUCTION_LINES(data: {
    siteId: string;
    productionLines: PrunApi.ProductionLine[];
  }) {
    store.setMany(data.productionLines);
  },
  PRODUCTION_PRODUCTION_LINE_UPDATED(data: PrunApi.ProductionLine) {
    store.setOne(data);
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

const getBySiteId = createRequestGetter(
  createGroupMapGetter(state.all, x => x.siteId),
  x => request.production(x),
);

export const productionStore = {
  ...state,
  getBySiteId,
};
