import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { computed, shallowReactive } from 'vue';

// Will be initialized before UI, so no need for undefined or fallbacks.
export const userDataStore = shallowReactive<PrunApi.UserData>({} as PrunApi.UserData);

export const companyContextId = computed(
  () => userDataStore.contexts?.find(x => x.type === 'COMPANY')?.id,
);

messages({
  COMPANY_DATA(data: PrunApi.UserData) {
    Object.assign(userDataStore, data);
  },
});
