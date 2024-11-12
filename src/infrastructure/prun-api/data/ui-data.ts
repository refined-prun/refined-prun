import { messages } from '@src/infrastructure/prun-api/data/api-messages';

// Will be initialized before UI, so no need for undefined or fallbacks.
export const uiDataStore = shallowReactive<PrunApi.UIData>({} as PrunApi.UIData);

messages({
  UI_DATA(data: PrunApi.UIData) {
    Object.assign(uiDataStore, data);
  },
});
