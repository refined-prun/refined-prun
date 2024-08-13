import { messages } from '@src/prun-api/data/api-messages';
import { createEntityStore } from '@src/prun-api/data/create-entity-store';

const store = createEntityStore<PrunApi.Star>(x => x.systemId);
const state = store.state;

messages({
  SYSTEM_STARS_DATA(data: { stars: PrunApi.Star[] }) {
    store.setAll(data.stars);
    store.setFetched();
  },
});

export const starsStore = {
  ...state,
};
