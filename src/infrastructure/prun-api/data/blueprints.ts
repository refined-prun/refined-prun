import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createRequestStore, request } from '@src/infrastructure/prun-api/data/request-hooks';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Blueprint>();
const state = store.state;

onApiMessage({
  BLUEPRINT_BLUEPRINTS(data: { blueprints: PrunApi.Blueprint[] }) {
    store.setAll(data.blueprints);
    store.setFetched();
  },
  BLUEPRINT_BLUEPRINT(data: PrunApi.Blueprint) {
    store.setOne(data);
  },
});

const getByNaturalId = createMapGetter(state.all, x => x.naturalId);

export const blueprintsStore = createRequestStore(request.blueprints, {
  ...state,
  getByNaturalId,
});
