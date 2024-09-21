import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { createRequestStore, request } from '@src/infrastructure/prun-api/data/request-hooks';

const store = createEntityStore<PrunApi.Alert>();
const state = store.state;

messages({
  ALERTS_ALERTS(data: { alerts: PrunApi.Alert[] }) {
    store.setMany(data.alerts);
    store.setFetched();
  },
  ALERTS_ALERT(data: PrunApi.Alert) {
    store.setOne(data);
  },
});

export const alertsStore = createRequestStore(request.blueprints, {
  ...state,
});
