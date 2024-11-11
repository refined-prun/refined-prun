import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { shallowRef } from 'vue';

export const companyStore = shallowRef<PrunApi.CompanyData | undefined>(undefined);

messages({
  COMPANY_DATA(data: PrunApi.CompanyData) {
    companyStore.value = data;
  },
});
