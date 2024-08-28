import { messages } from '@src/prun-api/data/api-messages';
import { createEntityStore } from '@src/prun-api/data/create-entity-store';
import { createMapGetter } from '@src/prun-api/data/create-map-getter';

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

const getByRegistration = createMapGetter(
  state.all,
  x => x.registration.toLowerCase(),
  x => x.toLowerCase(),
);

export const getShipLastRepair = (ship: PrunApi.Ship) =>
  ship.lastRepair?.timestamp || ship.commissioningTime.timestamp;

export const shipsStore = {
  ...state,
  getByRegistration,
};
