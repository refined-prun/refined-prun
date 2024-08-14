import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { createMapGetter } from '@src/prun-api/data/create-map-getter';

interface Planet {
  naturalId: string;
  name: string;
}

const store = createEntityStore<Planet>(x => x.naturalId);
const state = store.state;

messages({
  FIO_PLANET_DATA(data: { planets: Planet[] }) {
    store.setAll(data.planets);
    store.setFetched();
  },
});

const getByName = createMapGetter(state.all, x => x.name);
const getByIdOrName = (idOrName?: string | null) => state.getById(idOrName) ?? getByName(idOrName);

export const planetsStore = {
  ...state,
  getByName,
  getByIdOrName,
};
