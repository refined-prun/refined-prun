import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { shallowReactive } from 'vue';

// ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uiDataStore = shallowReactive<PrunApi.UIData>({} as any);

messages({
  UI_DATA(data: PrunApi.UIData) {
    Object.assign(uiDataStore, data);
  },
});
