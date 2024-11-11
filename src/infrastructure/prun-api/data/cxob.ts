import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

type Entity = PrunApi.CXBroker & { timestamp: number };

const store = createEntityStore<Entity>();
const state = store.state;

messages({
  COMEX_BROKER_DATA(data: PrunApi.CXBroker) {
    store.setOne({
      ...data,
      timestamp: Date.now(),
    });
    store.setFetched();
  },
});

const getByTicker = createMapGetter(state.all, x => x.ticker);

export const cxobStore = {
  ...state,
  getByTicker,
};
