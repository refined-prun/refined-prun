import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import {
  createGroupMapGetter,
  createMapGetter,
} from '@src/infrastructure/prun-api/data/create-map-getter';
import { createRequestGetter, request } from '@src/infrastructure/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.ProductionLine>();
const state = store.state;

messages({
  PRODUCTION_PRODUCTION_LINES(data: { productionLines: PrunApi.ProductionLine[] }) {
    store.setAll(data.productionLines);
    store.setFetched();
  },
  PRODUCTION_SITE_PRODUCTION_LINES(data: {
    siteId: string;
    productionLines: PrunApi.ProductionLine[];
  }) {
    store.setMany(data.productionLines);
    store.setFetched();
  },
  PRODUCTION_PRODUCTION_LINE(data: PrunApi.ProductionLine) {
    store.setOne(data);
    store.setFetched();
  },
  PRODUCTION_PRODUCTION_LINE_ADDED(data: PrunApi.ProductionLine) {
    store.setOne(data);
    store.setFetched();
  },
  PRODUCTION_PRODUCTION_LINE_UPDATED(data: PrunApi.ProductionLine) {
    store.setOne(data);
    store.setFetched();
  },
  PRODUCTION_ORDER_ADDED(data: PrunApi.ProductionOrder) {
    const entities = state.entities.value;
    const line = entities?.[data.productionLineId];
    if (entities === undefined || line === undefined) {
      return;
    }

    entities[data.productionLineId] = {
      ...line,
      orders: [...line.orders, data],
    };
  },
  PRODUCTION_ORDER_UPDATED(data: PrunApi.ProductionOrder) {
    const entities = state.entities.value;
    const line = entities?.[data.productionLineId];
    if (entities === undefined || line === undefined) {
      return;
    }

    entities[data.productionLineId] = {
      ...line,
      orders: line.orders.map(x => (x.id === data.id ? data : x)),
    };
  },
  PRODUCTION_ORDER_REMOVED(data: { orderId: string; productionLineId: string }) {
    const entities = state.entities.value;
    const line = entities?.[data.productionLineId];
    if (entities === undefined || line === undefined) {
      return;
    }

    entities[data.productionLineId] = {
      ...line,
      orders: line.orders.filter(x => x.id !== data.orderId),
    };
  },
});

const getByShortId = createMapGetter(state.all, x => x.id.substring(0, 8));

const getById = (value?: string | null) => state.getById(value) ?? getByShortId(value);

const getBySiteId = createRequestGetter(
  createGroupMapGetter(state.all, x => x.siteId),
  x => request.production(x),
);

export const productionStore = {
  ...state,
  getById,
  getBySiteId,
};
