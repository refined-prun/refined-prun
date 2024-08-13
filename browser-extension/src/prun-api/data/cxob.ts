import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';

type Entity = PrunApi.CXBroker & { timestamp: number };

const store = createEntityStore<Entity>(x => x.ticker);
const state = store.state;

messages({
  COMEX_BROKER_DATA(data: PrunApi.CXBroker) {
    store.setOne({
      ...data,
      timestamp: Date.now(),
    });
  },
});

const {
  // Store id is ticker, so remove getById to not confuse people.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById,
  ...filteredState
} = state;

export const cxobStore = {
  ...filteredState,
  getByTicker: state.getById,
};
