import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createRequestGetter, request } from '@src/infrastructure/prun-api/data/request-hooks';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

interface Entity {
  address: PrunApi.Address;
  siteId: string;
  workforces: PrunApi.Workforce[];
}

const store = createEntityStore<Entity>(x => x.siteId);
const state = store.state;

onApiMessage({
  WORKFORCE_WORKFORCES(data: Entity) {
    store.setOne(data);
    store.setFetched();
  },
  WORKFORCE_WORKFORCES_UPDATED(data: Entity) {
    store.setOne(data);
  },
});

const getByShortId = createMapGetter(state.all, x => x.siteId.substring(0, 8));

const getByAnyId = (value?: string | null) => state.getById(value) ?? getByShortId(value);

const getById = createRequestGetter(getByAnyId, x => request.workforce(x));

export const workforcesStore = {
  ...state,
  getById,
};
