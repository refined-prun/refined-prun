import { messages } from '@src/prun-api/data/api-messages';
import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { computed } from 'vue';

const store = createEntityStore<PrunApi.Star>(x => x.systemId);
const state = store.state;

messages({
  SYSTEM_STARS_DATA(data: { stars: PrunApi.Star[] }) {
    store.setAll(data.stars);
    store.setFetched();
  },
});

export function getStarNaturalId(star: PrunApi.Star) {
  return star.address.lines[0].entity.naturalId;
}

export function getStarName(star: PrunApi.Star) {
  return star.address.lines[0].entity.name;
}

const byNaturalId = computed(() => {
  const map = new Map<string, PrunApi.Star>();
  for (const star of state.all.value) {
    map.set(getStarNaturalId(star), star);
  }
  return map;
});

const byName = computed(() => {
  const map = new Map<string, PrunApi.Star>();
  for (const star of state.all.value) {
    map.set(getStarName(star), star);
  }
  return map;
});

function getByNaturalId(id?: string | undefined) {
  return id ? byNaturalId.value.get(id) : undefined;
}

function getByName(name?: string | undefined) {
  return name ? byName.value.get(name) : undefined;
}

export const starsStore = {
  ...state,
  getByNaturalId,
  getByName,
  getByPlanetNaturalId: (id?: string | undefined) => getByNaturalId(id?.slice(0, -1)),
};
