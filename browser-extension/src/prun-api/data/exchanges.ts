import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { createMapGetter } from '@src/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Exchange>();
const state = store.state;

messages({
  DATA_DATA(data: { body: PrunApi.Exchange[]; path: string[] }) {
    if (data.path.length !== 1 || data.path[0] !== 'commodityexchanges') {
      return;
    }
    store.setAll(data.body);
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
