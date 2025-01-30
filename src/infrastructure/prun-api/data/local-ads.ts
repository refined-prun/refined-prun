import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { castArray } from '@src/utils/cast-array';

const store = createEntityStore<PrunApi.LocalAd>();
const state = store.state;

onApiMessage({
  DATA_DATA(data: { body: Arrayable<PrunApi.LocalAd>; path: string[] }) {
    if (data.path[0] !== 'localmarkets' || data.path[2] !== 'ads') {
      return;
    }
    store.setMany(castArray(data.body));
    store.setFetched();
  },
  DATA_DATA_REMOVED(data: { path: string[] }) {
    const id = data.path[3];
    if (data.path[0] !== 'localmarkets' || data.path[2] !== 'ads' || id === undefined) {
      return;
    }
    store.removeOne(id);
  },
});

export const localAdsStore = {
  ...state,
};
