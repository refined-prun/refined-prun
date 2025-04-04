import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.Experts>(x => x.siteId);
const state = store.state;

onApiMessage({
  EXPERTS_EXPERTS(data: PrunApi.Experts) {
    store.setOne(data);
    store.setFetched();
  },
});

const getBySiteId = createMapGetter(state.all, x => x.siteId);

export const expertsStore = {
  ...state,
  getBySiteId,
};
