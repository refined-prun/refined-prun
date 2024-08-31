import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { computed } from 'vue';
import { request } from '@src/infrastructure/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.ShipyardProject>();
const state = store.state;

messages({
  SHIPYARD_PROJECTS(data: { projects: PrunApi.ShipyardProject[] }) {
    store.setAll(data.projects);
    store.setFetched();
  },
  SHIPYARD_PROJECT(data: PrunApi.ShipyardProject) {
    store.setOne(data);
  },
});

const all = (() => {
  const all = state.all;
  return computed(() => {
    if (!state.fetched.value) {
      request.shipyardProjects();
    }

    return all.value;
  });
})();

export const shipyardProjectsStore = {
  ...state,
  all,
};
