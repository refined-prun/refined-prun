import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.CorporationHolding>();
const state = store.state;

onApiMessage({
  CORPORATION_SHAREHOLDER_HOLDINGS(data: { holdings: PrunApi.CorporationHolding[] }) {
    store.setAll(data.holdings);
    store.setFetched();
  },
});

export const corporationHoldingsStore = {
  ...state,
};
