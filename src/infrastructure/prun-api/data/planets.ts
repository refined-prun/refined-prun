import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

interface Planet {
  naturalId: string;
  name: string;
}

const store = createEntityStore<Planet>(x => x.naturalId.toLowerCase(), {
  preserveOnConnectionOpen: true,
});
const state = store.state;

onApiMessage({
  FIO_PLANET_DATA(data: { planets: Planet[] }) {
    store.setAll(data.planets);
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
