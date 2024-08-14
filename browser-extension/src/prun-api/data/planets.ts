import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';
import { computed } from 'vue';

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

const byPlanetName = computed(() => {
  const map = new Map<string, Planet>();
  for (const planet of state.all.value) {
    map.set(planet.name, planet);
  }
  return map;
});

export const planetsStore = {
  ...state,
  getByName: (name?: string | undefined) => (name ? byPlanetName.value.get(name) : undefined),
  getByIdOrName: (idOrName?: string | undefined) =>
    planetsStore.getById(idOrName) ?? planetsStore.getByName(idOrName),
};
