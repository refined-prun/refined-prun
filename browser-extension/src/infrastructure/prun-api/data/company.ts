import { messages } from '@src/infrastructure/prun-api/data/api-messages';
import { shallowReactive } from 'vue';

// ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const companyStore = shallowReactive<PrunApi.CompanyData>({} as any);

messages({
  COMPANY_DATA(data: PrunApi.CompanyData) {
    Object.assign(companyStore, data);
  },
});
