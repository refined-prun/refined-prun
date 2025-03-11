import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';

const store = createEntityStore<PrunApi.ContractDraft>();
const state = store.state;

onApiMessage({
  CONTRACT_DRAFTS_DRAFTS(data: { drafts: PrunApi.ContractDraft[] }) {
    store.setAll(data.drafts);
    store.setFetched();
  },
  CONTRACT_DRAFTS_DRAFT(data: PrunApi.ContractDraft) {
    store.setOne(data);
  },
});

const getByNaturalId = createMapGetter(state.all, x => x.naturalId);

export const contractDraftsStore = {
  ...state,
  getByNaturalId,
};
