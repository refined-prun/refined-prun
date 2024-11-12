import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import {
  createGroupMapGetter,
  createMapGetter,
} from '@src/infrastructure/prun-api/data/create-map-getter';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.ProductionLine>();
const state = store.state;
const fetchedSites = reactive(new Set<string>());
const fetchedAll = ref(false);

messages({
  CLIENT_CONNECTION_OPENED() {
    fetchedSites.clear();
    fetchedAll.value = false;
  },
  PRODUCTION_PRODUCTION_LINES(data: { productionLines: PrunApi.ProductionLine[] }) {
    store.setAll(data.productionLines);
    fetchedAll.value = true;
    store.setFetched();
  },
  PRODUCTION_SITE_PRODUCTION_LINES(data: {
    siteId: string;
    productionLines: PrunApi.ProductionLine[];
  }) {
    store.setMany(data.productionLines);
    fetchedSites.add(data.siteId);
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
    const line = state.getById(data.productionLineId);
    if (line !== undefined) {
      store.setOne({
        ...line,
        orders: [...line.orders, data],
      });
    }
  },
  PRODUCTION_ORDER_UPDATED(data: PrunApi.ProductionOrder) {
    const line = state.getById(data.productionLineId);
    if (line !== undefined) {
      store.setOne({
        ...line,
        orders: line.orders.map(x => (x.id === data.id ? data : x)),
      });
    }
  },
  PRODUCTION_ORDER_REMOVED(data: { orderId: string; productionLineId: string }) {
    const line = state.getById(data.productionLineId);
    if (line !== undefined) {
      store.setOne({
        ...line,
        orders: line.orders.filter(x => x.id !== data.orderId),
      });
    }
  },
});

const getByShortId = createMapGetter(state.all, x => x.id.substring(0, 8));

const getById = (value?: string | null) => state.getById(value) ?? getByShortId(value);

const bySiteId = createGroupMapGetter(state.all, x => x.siteId);

const getBySiteId = (value?: string | null) => {
  const result = bySiteId(value);
  if (result) {
    return result;
  }

  if (!value) {
    return undefined;
  }

  if (fetchedAll.value || fetchedSites.has(value)) {
    return [];
  } else {
    request.production(value);
  }

  return undefined;
};

export const productionStore = {
  ...state,
  getById,
  getBySiteId,
};
