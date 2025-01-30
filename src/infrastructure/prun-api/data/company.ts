import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';

export const companyStore = shallowRef<PrunApi.CompanyData | undefined>(undefined);

onApiMessage({
  COMPANY_DATA(data: PrunApi.CompanyData) {
    companyStore.value = data;
  },
});
