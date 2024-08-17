import { messages } from '@src/prun-api/data/api-messages';
import { computed, shallowReactive } from 'vue';

// ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userDataStore = shallowReactive<PrunApi.UserData>({} as any);

export const companyContextId = computed(
  () => userDataStore.contexts?.find(x => x.type === 'COMPANY')?.id,
);

messages({
  COMPANY_DATA(data: PrunApi.UserData) {
    Object.assign(userDataStore, data);
  },
});
