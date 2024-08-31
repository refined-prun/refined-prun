import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';
import { computed } from 'vue';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Blueprint>();
const state = store.state;

messages({
  BLUEPRINT_BLUEPRINTS(data: { blueprints: PrunApi.Blueprint[] }) {
    store.setAll(data.blueprints);
    store.setFetched();
  },
  BLUEPRINT_BLUEPRINT(data: PrunApi.Blueprint) {
    store.setOne(data);
  },
});

const all = (() => {
  const all = state.all;
  return computed(() => {
    if (!state.fetched.value) {
      request.blueprints();
    }

    return all.value;
  });
})();

const getByNaturalId = createMapGetter(all, x => x.naturalId);

export const blueprintsStore = {
  ...state,
  all,
  getByNaturalId,
};
