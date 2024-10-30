import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

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

const getByRegistration = createMapGetter(state.all, x => x.registration);

export const getShipLastRepair = (ship: PrunApi.Ship) =>
  ship.lastRepair?.timestamp || ship.commissioningTime.timestamp;

export const shipsStore = {
  ...state,
  getByRegistration,
};
