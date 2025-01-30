import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import { castArray } from '@src/utils/cast-array';
import { isEmpty } from 'ts-extras';

const store = createEntityStore<PrunApi.Exchange>();
const state = store.state;

onApiMessage({
  DATA_DATA(data: { body: Arrayable<PrunApi.Exchange>; path: string[] }) {
    if (isEmpty(data.path) || data.path[0] !== 'commodityexchanges') {
      return;
    }
    store.setMany(castArray(data.body));
    store.setFetched();
  },
});

const getByCode = createMapGetter(state.all, x => x.code);

const getByName = createMapGetter(state.all, x => x.name);

export const exchangeStore = {
  ...state,
  getByCode,
  getByName,
};
