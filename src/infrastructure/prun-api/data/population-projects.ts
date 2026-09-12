import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.PopulationProject>();
const state = store.state;

onApiMessage({
  DATA_DATA(data: { body: PrunApi.PopulationProject; path: string[] }) {
    if (data.path.length !== 4 || data.path[0] !== 'populations' || data.path[2] !== 'projects') {
      return;
    }
    store.setOne(data.body);
    store.setFetched();
  },
});

export const populationProjectsStore = {
  ...state,
};
