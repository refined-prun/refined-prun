import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { messages } from '@src/prun-api/data/api-messages';

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

export const workforcesStore = {
  ...state,
};
