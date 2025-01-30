import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { createRequestStore, request } from '@src/infrastructure/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.ShipyardProject>();
const state = store.state;

onApiMessage({
  SHIPYARD_PROJECTS(data: { projects: PrunApi.ShipyardProject[] }) {
    store.setAll(data.projects);
    store.setFetched();
  },
  SHIPYARD_PROJECT(data: PrunApi.ShipyardProject) {
    store.setOne(data);
  },
});

export const shipyardProjectsStore = createRequestStore(request.shipyardProjects, {
  ...state,
});
