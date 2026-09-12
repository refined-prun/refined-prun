import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.Population>();
const state = store.state;

onApiMessage({
  DATA_DATA(data: { body: PrunApi.Population; path: string[] }) {
    if (data.path[0] !== 'populations' || data.path.length !== 2) {
      return;
    }
    store.setOne(data.body);
    store.setFetched();
  },
});

export const populationsStore = {
  ...state,
};
