import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { ref } from 'vue';

const store = createEntityStore<PrunApi.Flight>();
const state = store.state;

const plan = ref<PrunApi.FlightPlan | undefined>(undefined);

messages({
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
  SHIP_FLIGHT_MISSION(data: PrunApi.FlightPlan) {
    plan.value = data;
  },
});

export const flightsStore = {
  ...state,
  plan,
};
