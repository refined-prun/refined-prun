import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { messages } from '@src/infrastructure/prun-api/data/api-messages';

const store = createEntityStore<PrunApi.MaterialCategory>();
const state = store.state;

messages({
  WORLD_MATERIAL_CATEGORIES(data: { categories: PrunApi.MaterialCategory[] }) {
    store.setAll(data.categories);
    store.setFetched();
  },
});

export const materialCategoriesStore = {
  ...state,
};
