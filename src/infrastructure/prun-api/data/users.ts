import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.User>();
const state = store.state;

onApiMessage({
  DATA_DATA(data: { body: PrunApi.User; path: string[] }) {
    if (data.path[0] !== 'users') {
      return;
    }
    store.setOne(data.body);
    store.setFetched();
  },
});

const getByUsername = createMapGetter(state.all, x => x.username);

export const usersStore = {
  ...state,
  getByUsername,
};
