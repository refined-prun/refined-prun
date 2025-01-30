import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.Alert>();
const state = store.state;

onApiMessage({
  ALERTS_ALERTS(data: { alerts: PrunApi.Alert[] }) {
    store.setMany(data.alerts);
    store.setFetched();
  },
  ALERTS_ALERT(data: PrunApi.Alert) {
    store.setOne(data);
  },
});

export const alertsStore = {
  ...state,
};
