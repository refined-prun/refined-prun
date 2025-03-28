import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import { isEmpty } from 'ts-extras';

const store = createEntityStore<PrunApi.Planet>(x => x.naturalId.toLowerCase(), {
  preserveOnOpen: true,
});
const state = store.state;

onApiMessage({
  FIO_PLANET_DATA(data: { planets: PrunApi.Planet[] }) {
    store.setAll(data.planets);
    store.setFetched();
  },

  DATA_DATA(data: { body: PrunApi.Planet; path: string[] }) {
    if (isEmpty(data.path) || data.path[0] !== 'planets' || data.path[2]) {
      return;
    }
    console.log(data.body);
    store.setOne(data.body);
    store.setFetched();
  },
});

const getByNaturalId = createMapGetter(state.all, x => x.naturalId);

const getByName = createMapGetter(state.all, x => x.name);

const find = (naturalIdOrName?: string | null) =>
  getByNaturalId(naturalIdOrName) ?? getByName(naturalIdOrName);

export const planetsStore = {
  ...state,
  getByNaturalId,
  getByName,
  find,
};
