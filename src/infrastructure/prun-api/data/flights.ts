import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.Flight>();
const state = store.state;

onApiMessage({
  SHIP_FLIGHT_FLIGHTS(data: { flights: PrunApi.Flight[] }) {
    store.setAll(data.flights);
    store.setFetched();
  },
  SHIP_FLIGHT_FLIGHT(data: PrunApi.Flight) {
    store.setOne(data);
  },
  SHIP_FLIGHT_FLIGHT_ENDED(data: PrunApi.Flight) {
    store.removeOne(data.id);
  },
});

export const flightsStore = {
  ...state,
};
