import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.FlightPlan>(x => x.missionId);
const state = store.state;

messages({
  SHIP_FLIGHT_MISSION(data: PrunApi.FlightPlan) {
    store.setOne(data);
    store.setFetched();
  },
});

export const flightPlansStore = {
  ...state,
};
