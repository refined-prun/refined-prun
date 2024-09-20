import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import { castArray } from '@src/utils/cast-array';

const store = createEntityStore<PrunApi.Exchange>();
const state = store.state;

messages({
  DATA_DATA(data: { body: Arrayable<PrunApi.Exchange>; path: string[] }) {
    if (data.path.length === 0 || data.path[0] !== 'commodityexchanges') {
      return;
    }
    store.setMany(castArray(data.body));
    store.setFetched();
  },
});

const getByCode = createMapGetter(
  state.all,
  x => x.code,
  x => x.toUpperCase(),
);

const getByName = createMapGetter(
  state.all,
  x => x.name.toUpperCase(),
  x => x.toUpperCase(),
);

export const exchangeStore = {
  ...state,
  getByCode,
  getByName,
};
