import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

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

const getByNaturalId = createMapGetter(state.all, getStarNaturalId);
const getByName = createMapGetter(state.all, getStarName);
const getByPlanetNaturalId = (id?: string | null) => getByNaturalId(id?.slice(0, -1));

const find = (value?: string | null) =>
  getByNaturalId(value) ?? getByName(value) ?? getByPlanetNaturalId(value);

export const starsStore = {
  ...state,
  getByNaturalId,
  getByName,
  getByPlanetNaturalId,
  find,
};
