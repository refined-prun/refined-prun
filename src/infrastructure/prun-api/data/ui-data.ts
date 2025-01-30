import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

// Will be initialized before UI, so no need for undefined or fallbacks.
export const uiDataStore = shallowReactive<PrunApi.UIData>({} as PrunApi.UIData);

onApiMessage({
  UI_DATA(data: PrunApi.UIData) {
    Object.assign(uiDataStore, data);
  },
});
