import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.CXBrokerPrices>(x => x.brokerId);
const state = store.state;

onApiMessage({
  COMEX_BROKER_PRICES(data: PrunApi.CXBrokerPrices) {
    store.setOne(data);
    store.setFetched();
    for (const callback of pricesReceivedCallbacks) {
      callback(data);
    }
  },
});

const pricesReceivedCallbacks = [] as ((data: PrunApi.CXBrokerPrices) => void)[];

export const cxpcStore = {
  ...state,
  onPricesReceived(callback: (data: PrunApi.CXBrokerPrices) => void) {
    pricesReceivedCallbacks.push(callback);
  },
  offPricesReceived(callback: (data: PrunApi.CXBrokerPrices) => void) {
    pricesReceivedCallbacks.splice(pricesReceivedCallbacks.indexOf(callback), 1);
  },
};
