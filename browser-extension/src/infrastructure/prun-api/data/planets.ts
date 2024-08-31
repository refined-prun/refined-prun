import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

interface Planet {
  naturalId: string;
  name: string;
}

const store = createEntityStore<Planet>(x => x.naturalId.toLowerCase());
const state = store.state;

messages({
  FIO_PLANET_DATA(data: { planets: Planet[] }) {
    store.setAll(data.planets);
    store.setFetched();
  },
});

const getById = createMapGetter(
  state.all,
  x => x.naturalId.toLowerCase(),
  x => x.toLowerCase(),
);

const getByName = createMapGetter(
  state.all,
  x => x.name.toLowerCase(),
  x => x.toLowerCase(),
);

const getByIdOrName = (value?: string | null) => getById(value) ?? getByName(value);

export const planetsStore = {
  ...state,
  getById,
  getByName,
  getByIdOrName,
};
