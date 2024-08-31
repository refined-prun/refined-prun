import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createRequestGetter, request } from '@src/infrastructure/prun-api/data/request-hooks';

interface Entity {
  address: PrunApi.Address;
  siteId: string;
  workforces: PrunApi.Workforce[];
}

const store = createEntityStore<Entity>(x => x.siteId);
const state = store.state;

messages({
  WORKFORCE_WORKFORCES(data: Entity) {
    store.setOne(data);
  },
  WORKFORCE_WORKFORCES_UPDATED(data: Entity) {
    store.setOne(data);
  },
});

const getById = createRequestGetter(state.getById, x => request.workforce(x));

export const workforcesStore = {
  ...state,
  getById,
};
