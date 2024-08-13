import { messages } from '@src/prun-api/data/api-messages';
import { createEntityStore } from '@src/prun-api/data/create-entity-store';

const store = createEntityStore<PrunApi.Ship>();
const state = store.state;

messages({
  SHIP_SHIPS(data: { ships: PrunApi.Ship[] }) {
    store.setAll(data.ships);
    store.setFetched();
  },
  SHIP_DATA(data: PrunApi.Ship) {
    store.setOne(data);
  },
});

function getByRegistration(registration?: string | null) {
  return state.all.value.find(x => x.registration === registration);
}

export const shipsStore = {
  ...state,
  getByRegistration,
};
