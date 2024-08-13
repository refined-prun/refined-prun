import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.Contract>();
const state = store.state;

messages({
  CONTRACTS_CONTRACTS(data: { contracts: PrunApi.Contract[] }) {
    store.setAll(data.contracts);
    store.setFetched();
  },
  CONTRACTS_CONTRACT(data: PrunApi.Contract) {
    store.setOne(data);
  },
});

export const contractsStore = {
  ...state,
};
