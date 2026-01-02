import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.CXBrokerPrices>(x => x.brokerId);
const state = store.state;

onApiMessage({
  COMEX_BROKER_PRICES(data: PrunApi.CXBrokerPrices) {
    store.setOne(data);
    store.setFetched();
  },
});

export const cxpcStore = {
  ...state,
};
