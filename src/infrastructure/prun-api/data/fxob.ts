import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.FXBroker>();
const state = store.state;

onApiMessage({
  FOREX_BROKER_DATA(data: PrunApi.FXBroker) {
    store.setOne(data);
    store.setFetched();
  },
});

const getByTicker = createMapGetter(state.all, x => x.ticker);

export const fxobStore = {
  ...state,
  getByTicker,
};
