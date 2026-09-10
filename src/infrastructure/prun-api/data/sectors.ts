import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';

const store = createEntityStore<PrunApi.Sector>();
const state = store.state;

onApiMessage({
  WORLD_SECTORS(data: { sectors: PrunApi.Sector[] }) {
    store.setAll(data.sectors);
    store.setFetched();
  },
});

export const sectorsStore = {
  ...state,
};
